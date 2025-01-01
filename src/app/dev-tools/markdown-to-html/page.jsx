"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Trash, FileDown, ClipboardCheck } from 'lucide-react';
import { marked } from 'marked';

const MarkdownToHtml = () => {
  const [markdown, setMarkdown] = useState('');
  const [html, setHtml] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [copied, setCopied] = useState({ markdown: false, html: false });

  const convertToHtml = () => {
    try {
      marked.setOptions({ breaks: true, gfm: true });
      const result = marked(markdown);
      setHtml(result);
    } catch (error) {
      setHtml('Error converting markdown to HTML');
    }
  };

  const handleCopy = (type) => {
    const text = type === 'markdown' ? markdown : html;
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Markdown to HTML Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Markdown Input</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy('markdown')}
                  >
                    {copied.markdown ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="relative rounded-md overflow-hidden">
                  <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="w-full min-h-[400px] p-4 font-mono text-sm bg-slate-900 text-purple-400 resize-none focus:ring-2 focus:ring-blue-500 border-none"
                    placeholder="Enter Markdown here..."
                    spellCheck="false"
                    style={{ lineHeight: '1.5', caretColor: 'white' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">HTML Output</label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy('html')}
                    >
                      {copied.html ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={downloadHtml}
                      disabled={!html}
                    >
                      <FileDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="relative rounded-md overflow-hidden">
                  <textarea
                    value={html}
                    readOnly
                    className="w-full min-h-[400px] p-4 font-mono text-sm bg-slate-900 text-green-400 resize-none border-none"
                    spellCheck="false"
                    style={{ lineHeight: '1.5' }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="border rounded-lg p-6 min-h-[400px] prose prose-sm max-w-none dark:prose-invert bg-white dark:bg-slate-900">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button onClick={convertToHtml}>Convert to HTML</Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setMarkdown('');
              setHtml('');
            }}
          >
            <Trash className="w-4 h-4 mr-2" /> Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkdownToHtml;