"use client";
import React, { useState, useRef, useCallback } from 'react';
import { Download, Link, QrCode, Clipboard, Check, RefreshCw, Image as ImageIcon, Upload, Trash2, Eye, Loader2 } from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const QRGenerator = () => {
  // Keep all existing state variables
  const [text, setText] = useState('');
  const [size, setSize] = useState('300');
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [margin, setMargin] = useState(4);
  const [bgColor, setBgColor] = useState('FFFFFF');
  const [fgColor, setFgColor] = useState('000000');
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [type, setType] = useState('text');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [advanced, setAdvanced] = useState(false);
  const [dotStyle, setDotStyle] = useState('square');
  const [gradient, setGradient] = useState(false);
  const [gradientColor, setGradientColor] = useState('000000');
  const [logoImage, setLogoImage] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoSize, setLogoSize] = useState(20);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // vCard state and generator remain the same
  const [vCardData, setVCardData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    website: '',
    address: ''
  });

  const generateVCard = useCallback(() => {
    const { name, email, phone, company, title, website, address } = vCardData;
    let vCard = 'BEGIN:VCARD\nVERSION:3.0\n';
    
    if (name) vCard += `FN:${name}\n`;
    if (email) vCard += `EMAIL:${email}\n`;
    if (phone) vCard += `TEL:${phone}\n`;
    if (company) vCard += `ORG:${company}\n`;
    if (title) vCard += `TITLE:${title}\n`;
    if (website) vCard += `URL:${website}\n`;
    if (address) vCard += `ADR:;;${address};;;;\n`;
    
    vCard += 'END:VCARD';
    return vCard;
  }, [vCardData]);

  // Modified QR generation function using qrcode.js
  const generateQR = async () => {
    try {
      setError('');
      if (!text && type !== 'vcard') {
        setError('Please enter some content');
        return;
      }

      setLoading(true);
      
      let content = text;
      if (type === 'vcard') {
        content = generateVCard();
      }
      if (type === 'url' && !content.startsWith('http')) {
        content = `https://${content}`;
      }

      // Configure QR code options
      const qrOptions = {
        errorCorrectionLevel: errorCorrection,
        margin: margin,
        width: parseInt(size),
        color: {
          dark: `#${fgColor}`,
          light: `#${bgColor}`
        }
      };

      // Generate QR code as data URL
      const dataUrl = await QRCode.toDataURL(content, qrOptions);
      
      // If logo is present, composite it with the QR code
      if (logoImage && logoPreview) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const qrImage = new Image();
        
        qrImage.onload = () => {
          canvas.width = qrImage.width;
          canvas.height = qrImage.height;
          ctx.drawImage(qrImage, 0, 0);

          const logo = new Image();
          logo.onload = () => {
            const logoWidth = (qrImage.width * logoSize) / 100;
            const logoHeight = (qrImage.height * logoSize) / 100;
            const logoX = (qrImage.width - logoWidth) / 2;
            const logoY = (qrImage.height - logoHeight) / 2;
            
            ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
            setQrUrl(canvas.toDataURL());
            setLoading(false);
          };
          logo.src = logoPreview;
        };
        qrImage.src = dataUrl;
      } else {
        setQrUrl(dataUrl);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to generate QR code');
      console.error(err);
      setLoading(false);
    }
  };

  // Modified download function for data URL
  const downloadQR = async () => {
    if (!qrUrl) return;
    
    try {
      const a = document.createElement('a');
      a.href = qrUrl;
      a.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download QR code');
      console.error(err);
    }
  };

  // Keep all other functions the same
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError('Image size should be less than 1MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(file);
        setLogoPreview(reader.result);
        setError('');
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoImage(null);
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyQrUrl = () => {
    try {
      navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy URL');
    }
  };

  const generateRandomColor = () => {
    return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
  };

  const randomizeColors = () => {
    setBgColor(generateRandomColor());
    setFgColor(generateRandomColor());
    if (gradient) {
      setGradientColor(generateRandomColor());
    }
  };
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="w-6 h-6" />
          Enhanced QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="text" value={type} onValueChange={setType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="vcard">vCard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <Textarea
              placeholder="Enter text to encode"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          </TabsContent>
          
          <TabsContent value="url">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter URL (e.g., example.com)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                type="url"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setText(window.location.href)}
                title="Use current URL"
              >
                <Link className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="vcard" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Full Name"
                value={vCardData.name}
                onChange={(e) => setVCardData({...vCardData, name: e.target.value})}
              />
              <Input
                placeholder="Email"
                type="email"
                value={vCardData.email}
                onChange={(e) => setVCardData({...vCardData, email: e.target.value})}
              />
              <Input
                placeholder="Phone"
                type="tel"
                value={vCardData.phone}
                onChange={(e) => setVCardData({...vCardData, phone: e.target.value})}
              />
              <Input
                placeholder="Company"
                value={vCardData.company}
                onChange={(e) => setVCardData({...vCardData, company: e.target.value})}
              />
              <Input
                placeholder="Job Title"
                value={vCardData.title}
                onChange={(e) => setVCardData({...vCardData, title: e.target.value})}
              />
              <Input
                placeholder="Website"
                type="url"
                value={vCardData.website}
                onChange={(e) => setVCardData({...vCardData, website: e.target.value})}
              />
            </div>
            <Textarea
              placeholder="Address"
              value={vCardData.address}
              onChange={(e) => setVCardData({...vCardData, address: e.target.value})}
              rows={2}
            />
          </TabsContent>
        </Tabs>

        <div className="flex items-center space-x-2">
          <Switch
            id="advanced-mode"
            checked={advanced}
            onCheckedChange={setAdvanced}
          />
          <Label htmlFor="advanced-mode">Advanced Options</Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger>
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100x100</SelectItem>
              <SelectItem value="200">200x200</SelectItem>
              <SelectItem value="300">300x300</SelectItem>
              <SelectItem value="400">400x400</SelectItem>
              <SelectItem value="500">500x500</SelectItem>
              <SelectItem value="600">600x600</SelectItem>
              <SelectItem value="700">700x700</SelectItem>
            </SelectContent>
          </Select>

          <Select value={errorCorrection} onValueChange={setErrorCorrection}>
            <SelectTrigger>
              <SelectValue placeholder="Error Correction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Low (7%)</SelectItem>
              <SelectItem value="M">Medium (15%)</SelectItem>
              <SelectItem value="Q">Quarter (25%)</SelectItem>
              <SelectItem value="H">High (30%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {advanced && (
          <>
            <div className="space-y-2">
              <Label>Margin: {margin}</Label>
              <Slider
                value={[margin]}
                onValueChange={([value]) => setMargin(value)}
                max={10}
                min={0}
                step={1}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select value={dotStyle} onValueChange={setDotStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Dot Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Switch
                  id="gradient-mode"
                  checked={gradient}
                  onCheckedChange={setGradient}
                />
                <Label htmlFor="gradient-mode">Use Gradient</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Background Color</Label>
                <div className="flex mt-1 space-x-2">
                  <Input
                    type="color"
                    value={`#${bgColor}`}
                    onChange={(e) => setBgColor(e.target.value.slice(1))}
                    className="w-full h-10"
                  />
                </div>
              </div>
              <div>
                <Label>Foreground Color</Label>
                <div className="flex mt-1 space-x-2">
                  <Input
                    type="color"
                    value={`#${fgColor}`}
                    onChange={(e) => setFgColor(e.target.value.slice(1))}
                    className="w-full h-10"
                  />
                </div>
              </div>
            </div>

            {gradient && (
              <div>
                <Label>Gradient Color</Label>
                <div className="flex mt-1 space-x-2">
                  <Input
                    type="color"
                    value={`#${gradientColor}`}
                    onChange={(e) => setGradientColor(e.target.value.slice(1))}
                    className="w-full h-10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Logo Image</Label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                  {logoImage && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeLogo}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {logoPreview && (
                <div className="flex items-center space-x-4">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-16 h-16 object-contain bg-gray-50 rounded"
                  /><div className="flex-1">
                  <Label>Logo Size: {logoSize}%</Label>
                  <Slider
                    value={[logoSize]}
                    onValueChange={([value]) => setLogoSize(value)}
                    max={30}
                    min={5}
                    step={1}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex space-x-2">
        <Button 
          onClick={generateQR} 
          className="flex-1" 
          disabled={loading || (type !== 'vcard' && !text)}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate QR Code'
          )}
        </Button>
        <Button 
          onClick={randomizeColors} 
          variant="outline" 
          size="icon"
          title="Randomize Colors"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {qrUrl && (
        <div className="space-y-4">
          <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
            <img 
              src={qrUrl} 
              alt="Generated QR Code" 
              className="max-w-full shadow-sm"
              style={{
                imageRendering: 'pixelated',
                maxHeight: `${parseInt(size)}px`
              }}
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={downloadQR} 
              variant="outline" 
              className="flex-1 gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download
            </Button>
            <Button 
              onClick={copyQrUrl} 
              variant="outline" 
              className="flex-1 gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Clipboard className="w-4 h-4" />
                  Copy URL
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {type === 'url' && text && !text.startsWith('http') && (
        <Alert>
          <AlertDescription>
            URLs will automatically be prefixed with https:// if no protocol is specified
          </AlertDescription>
        </Alert>
      )}
    </CardContent>
  </Card>
);
};

export default QRGenerator;