"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Share2, Check, Loader2, Search, Clock, Lock, Eye, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/app/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const shortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

const PasswordModal = ({ isOpen, onClose, onSubmit, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password);
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Protected Paste</DialogTitle>
          <DialogDescription>
            This paste is password protected. Please enter the password to view it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const PasteBin = () => {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [formattedContent, setFormattedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [pasteDetails, setPasteDetails] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [expiryTime, setExpiryTime] = useState('24');
  const [lineNumbers, setLineNumbers] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      fetchPaste(code);
    }
  }, []);

  
  const formatCode = (code, lang) => {
    const lines = code.split('\n');
    if (!lineNumbers) return code;
    
    return lines.map((line, index) => 
      `${(index + 1).toString().padStart(4, ' ')} | ${line}`
    ).join('\n');
  };

  const downloadContent = () => {
    const element = document.createElement('a');
    const file = new Blob([formattedContent || content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `paste-${pasteDetails?.short_code || 'content'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const savePaste = async () => {
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const expiryHours = parseInt(expiryTime);
      const expiryDate = new Date(new Date().getTime() + expiryHours * 60 * 60 * 1000);
      
      const pasteData = {
        content,
        language,
        formatted_content: formattedContent || content,
        expires_at: expiryDate,
        short_code: shortCode(),
        is_private: isPrivate,
        password: isPrivate ? password : null,
        views: 0,
        line_numbers: lineNumbers
      };

      const { data, error: saveError } = await supabase
        .from('pastes')
        .insert([pasteData])
        .select('short_code')
        .single();

      if (saveError) throw saveError;

      const url = `${window.location.origin}/data-tools/copy-paste-bin?code=${data.short_code}`;
      setShareUrl(url);
      toast({
        title: `Paste saved and will expire in ${expiryHours} hours`,
        duration: 2000
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, type = 'content') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      const messages = {
        content: 'Content copied to clipboard',
        url: 'Share URL copied to clipboard',
        code: 'Short code copied to clipboard'
      };
      
      toast({
        title: messages[type] || 'Copied to clipboard',
        duration: 2000
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        textArea.remove();
        
        if (successful) {
          setCopied(true);
          toast({
            title: 'Content copied to clipboard (fallback method)',
            duration: 2000
          });
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('Fallback copy method failed');
        }
      } catch (fallbackErr) {
        setError('Failed to copy to clipboard. Your browser may not support this feature.');
        toast({
          title: 'Failed to copy to clipboard',
          variant: 'destructive',
          duration: 3000
        });
      }
    }
  };

  const handlePasswordSubmit = async (inputPassword) => {
    await fetchPaste(currentCode, inputPassword);
  };

  const fetchPaste = async (code, inputPassword = '') => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('pastes')
        .select('*')
        .eq('short_code', code)
        .single();

      if (fetchError) throw fetchError;

      if (data.is_private) {
        if (!inputPassword) {
          setCurrentCode(code);
          setShowPasswordModal(true);
          return;
        }
        
        if (data.password !== inputPassword) {
          setPasswordError('Incorrect password');
          return;
        }
      }

      if (new Date(data.expires_at) < new Date()) {
        setError('This paste has expired');
        return;
      }

      setContent(data.content);
      setLanguage(data.language);
      setFormattedContent(formatCode(data.formatted_content, data.language));
      setLineNumbers(data.line_numbers);
      setPasteDetails({
        ...data,
        created_at: new Date(data.created_at).toLocaleString(),
        expires_at: new Date(data.expires_at).toLocaleString()
      });
      
      // Update view count
      await supabase
        .from('pastes')
        .update({ views: (data.views || 0) + 1 })
        .eq('short_code', code);

      // Close modal and clear errors on successful fetch
      setShowPasswordModal(false);
      setPasswordError('');

      toast({
        title: "Paste loaded successfully",
        duration: 2000
      });
    } catch (err) {
      setError('Failed to fetch paste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Enhanced Paste Bin</span>
            <div className="flex gap-4 items-center">
              <div className="flex w-64 gap-2">
                <Input
                  placeholder="Enter short code..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchPaste(searchCode)}
                />
                <Button onClick={() => fetchPaste(searchCode)} disabled={loading} size="icon">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plaintext">Plain Text</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="editor">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              {pasteDetails && <TabsTrigger value="details">Details</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="editor" className="space-y-4">
              <Textarea
                className="h-64 font-mono text-sm"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setError('');
                }}
                placeholder="Paste your content here..."
                spellCheck="false"
              />

              <div className="flex flex-wrap gap-2">
                <Button onClick={savePaste} disabled={!content || loading}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Save & Share
                </Button>
                <Button onClick={downloadContent} disabled={!content} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setContent('')} variant="outline" disabled={loading}>
                  Clear
                </Button>
                {formattedContent && (
                  <Button onClick={() => copyToClipboard(formattedContent)} variant="outline">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy
                  </Button>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {shareUrl && (
                <div className="flex items-center gap-2 bg-secondary p-2 rounded-md">
                  <Input value={shareUrl} readOnly className="bg-background" />
                  <Button onClick={() => copyToClipboard(shareUrl, 'url')} variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {formattedContent && (
                <div className="relative">
                  <Textarea
                    value={formattedContent}
                    readOnly
                    className="h-64 font-mono text-sm"
                  />
                  <Button
                    className="absolute top-2 right-2"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formattedContent)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                  <Label>Private Paste</Label>
                </div>
                
                {isPrivate && (
                  <Input
                    type="password"
                    placeholder="Enter password to protect paste"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}

                <div className="flex items-center gap-2">
                  <Switch
                    checked={lineNumbers}
                    onCheckedChange={setLineNumbers}
                  />
                  <Label>Show Line Numbers</Label>
                </div>

                <div className="flex items-center gap-4">
                  <Label>Expiry Time (hours):</Label>
                  <Select value={expiryTime} onValueChange={setExpiryTime}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select expiry time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="72">3 days</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                      <SelectItem value="720">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div></div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {pasteDetails && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Created:</div>
                    <div>{pasteDetails.created_at}</div>
                    <div className="font-medium">Expires:</div>
                    <div>{pasteDetails.expires_at}</div>
                    <div className="font-medium">Views:</div>
                    <div>{pasteDetails.views}</div>
                    <div className="font-medium">Language:</div>
                    <div className="capitalize">{pasteDetails.language}</div>
                    <div className="font-medium">Short Code:</div>
                    <div>{pasteDetails.short_code}</div>
                    <div className="font-medium">Privacy:</div>
                    <div>{pasteDetails.is_private ? 'Private' : 'Public'}</div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordError('');
        }}
        onSubmit={handlePasswordSubmit}
        error={passwordError}
      />
    </>
  );
};

export default PasteBin;