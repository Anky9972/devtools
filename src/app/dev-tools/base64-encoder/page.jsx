"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Trash, AlertCircle, ClipboardCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Base64Converter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      setError('');
      const encoded = btoa(input);
      setOutput(encoded);
    } catch {
      setError('Invalid input for encoding');
      setOutput('');
    }
  };

  const decode = () => {
    try {
      setError('');
      const decoded = atob(input);
      setOutput(decoded);
    } catch {
      setError('Invalid Base64 string');
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Base64 Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="encode" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full min-h-[200px] p-4 font-mono text-sm bg-slate-900 text-blue-400 rounded-md resize-none focus:ring-2 focus:ring-blue-500 border-none"
                placeholder="Enter text to convert..."
                style={{ lineHeight: '1.5', caretColor: 'white' }}
              />
            </div>

            <div className="flex justify-end items-center space-x-2">
              <Button variant="outline" onClick={clear}>
                <Trash className="w-4 h-4 mr-2" />Clear
              </Button>
              <TabsContent value="encode">
                <Button onClick={encode} className='mb-2'>Encode to Base64</Button>
              </TabsContent>
              <TabsContent value="decode">
                <Button onClick={decode} className='mb-2'>Decode from Base64</Button>
              </TabsContent>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Output</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!output}
                >
                  {copied ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="relative rounded-md overflow-hidden">
                <textarea
                  value={output}
                  readOnly
                  className="w-full min-h-[200px] p-4 font-mono text-sm bg-slate-900 text-green-400 rounded-md resize-none border-none"
                  style={{ lineHeight: '1.5' }}
                />
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Base64Converter;