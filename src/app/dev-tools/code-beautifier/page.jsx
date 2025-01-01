"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Trash, ClipboardCheck, FileDown } from 'lucide-react';

const CodeBeautifier = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [mode, setMode] = useState('beautify');
  const [copied, setCopied] = useState({ input: false, output: false });
  const [tabSize, setTabSize] = useState('2');

  const beautifyCode = (code, spaces) => {
    if (!code.trim()) return '';
    
    const indentSize = ' '.repeat(Number(spaces));
    
    try {
      switch (language) {
        case 'javascript':
          return code
            .replace(/\s+/g, ' ')
            .replace(/{/g, ' {\n' + indentSize)
            .replace(/}/g, '\n}')
            .replace(/;(?!\n)/g, ';\n')
            .replace(/(if|for|while|function|return|var|let|const)(\()/g, '$1 $2')
            .replace(/([+\-*/%=<>])/g, ' $1 ')
            .split('\n')
            .map(line => indentSize.repeat((line.match(/{/g) || []).length) + line.trim())
            .join('\n');

        case 'css':
          return code
            .replace(/\s+/g, ' ')
            .replace(/{/g, ' {\n' + indentSize)
            .replace(/}/g, '\n}')
            .replace(/;(?!\n)/g, ';\n' + indentSize)
            .replace(/:\s*/g, ': ')
            .split('\n')
            .map(line => line.trim())
            .join('\n');

        case 'html':
          return code
            .replace(/>\s+</g, '>\n<')
            .replace(/</g, '\n<')
            .split('\n')
            .map(line => {
              const depth = (line.match(/<\/|<[^!].*>/g) || []).length;
              return indentSize.repeat(depth) + line.trim();
            })
            .join('\n');

        case 'sql':
          return code
            .replace(/\s+/g, ' ')
            .replace(/(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|JOIN|LEFT|RIGHT|INNER|OUTER|UNION|INSERT|UPDATE|DELETE)/gi, '\n$1')
            .split('\n')
            .map(line => line.trim())
            .join('\n');

        default:
          return code;
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  };

  const minifyCode = (code) => {
    try {
      switch (language) {
        case 'javascript':
          return code
            .replace(/\s+/g, ' ')
            .replace(/;\s+/g, ';')
            .replace(/{\s+/g, '{')
            .replace(/}\s+/g, '}')
            .trim();

        case 'css':
          return code
            .replace(/\s+/g, ' ')
            .replace(/;\s+/g, ';')
            .replace(/{\s+/g, '{')
            .replace(/}\s+/g, '}')
            .replace(/:\s+/g, ':')
            .trim();

        case 'html':
          return code
            .replace(/>\s+</g, '><')
            .replace(/\s+/g, ' ')
            .trim();

        case 'sql':
          return code
            .replace(/\s+/g, ' ')
            .trim();

        default:
          return code;
      }
    } catch (error) {
      return `Error: ${error.message}`;
    }
  };

  const handleProcess = () => {
    const result = mode === 'beautify' ? beautifyCode(input, tabSize) : minifyCode(input);
    setOutput(result);
  };

  const handleCopy = (type) => {
    const text = type === 'input' ? input : output;
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beautified.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Code Beautifier & Minifier</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-center">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beautify">Beautify</SelectItem>
              <SelectItem value="minify">Minify</SelectItem>
            </SelectContent>
          </Select>

          {mode === 'beautify' && (
            <Select value={tabSize} onValueChange={setTabSize}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Tab Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Spaces</SelectItem>
                <SelectItem value="4">4 Spaces</SelectItem>
                <SelectItem value="8">8 Spaces</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Input Code</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy('input')}
              >
                {copied.input ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full min-h-[400px] p-4 font-mono text-sm bg-slate-900 text-blue-400 rounded-md resize-none focus:ring-2 focus:ring-blue-500 border-none"
              placeholder={`Enter ${language} code here...`}
              spellCheck="false"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Output Code</label>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy('output')}
                  disabled={!output}
                >
                  {copied.output ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadCode}
                  disabled={!output}
                >
                  <FileDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full min-h-[400px] p-4 font-mono text-sm bg-slate-900 text-green-400 rounded-md resize-none border-none"
              spellCheck="false"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleProcess}>
            {mode === 'beautify' ? 'Beautify' : 'Minify'} Code
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setInput('');
              setOutput('');
            }}
          >
            <Trash className="w-4 h-4 mr-2" /> Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeBeautifier;