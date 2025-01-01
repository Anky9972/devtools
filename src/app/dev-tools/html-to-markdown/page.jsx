"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Trash, FileDown, Upload, ClipboardCheck } from 'lucide-react';
import { marked } from 'marked';
import TurndownService from 'turndown';

const HtmlToMarkdown = () => {
  const [html, setHtml] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [copied, setCopied] = useState({ html: false, markdown: false });

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-'
  });

  const convertToMarkdown = () => {
    try {
      const result = turndownService.turndown(html);
      setMarkdown(result);
    } catch (error) {
      setMarkdown('Error converting HTML to markdown');
    }
  };

  const handleCopy = (type) => {
    const text = type === 'html' ? html : markdown;
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setHtml(e.target.result);
      reader.readAsText(file);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          HTML to Markdown Converter
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".html,.htm"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </Button>
        </CardTitle>
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
                  <label className="text-sm font-medium">HTML Input</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy('html')}
                  >
                    {copied.html ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="relative rounded-md overflow-hidden">
                  <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    className="w-full min-h-[400px] p-4 font-mono text-sm bg-slate-900 text-green-400 resize-none focus:ring-2 focus:ring-blue-500 border-none"
                    placeholder="Enter HTML here..."
                    spellCheck="false"
                    style={{
                      caretColor: 'white',
                      lineHeight: '1.5'
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Markdown Output</label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy('markdown')}
                    >
                      {copied.markdown ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={downloadMarkdown}
                      disabled={!markdown}
                    >
                      <FileDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="relative rounded-md overflow-hidden">
                  <textarea
                    value={markdown}
                    readOnly
                    className="w-full min-h-[400px] p-4 font-mono text-sm bg-slate-900 text-purple-400 resize-none border-none"
                    spellCheck="false"
                    style={{
                      caretColor: 'white',
                      lineHeight: '1.5'
                    }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="border rounded-lg p-6 min-h-[400px] prose prose-sm max-w-none dark:prose-invert bg-white dark:bg-slate-900">
              <div dangerouslySetInnerHTML={{ __html: marked(markdown) }} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button onClick={convertToMarkdown}>Convert to Markdown</Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setHtml('');
              setMarkdown('');
            }}
          >
            <Trash className="w-4 h-4 mr-2" /> Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HtmlToMarkdown;