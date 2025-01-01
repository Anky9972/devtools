"use client";
import React, { useState } from 'react';
import { Copy, Check, FileCode, AlertTriangle, Trash, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setFormatted('');
        setError('');
        return;
      }

      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormatted(formatted);
      setError('');
    } catch (err) {
      setError(err.message);
      setFormatted('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setFormatted('');
    setError('');
  };

  const handleDownload = () => {
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const syntaxHighlight = (json) => {
    if (!json) return '';
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let className = 'text-blue-600'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            className = 'text-gray-800 font-semibold'; // key
          } else {
            className = 'text-green-600'; // string
          }
        } else if (/true|false/.test(match)) {
          className = 'text-purple-600'; // boolean
        } else if (/null/.test(match)) {
          className = 'text-red-600'; // null
        }
        return `<span class="${className}">${match}</span>`;
      }
    );
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-6 h-6" />
          JSON Formatter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Input JSON
          </label>
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            placeholder="Paste your JSON here..."
            className="font-mono h-48"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={formatJson} className="gap-2">
            <FileCode className="w-4 h-4" /> Format
          </Button>
          <Button variant="outline" onClick={handleClear} className="gap-2">
            <Trash className="w-4 h-4" /> Clear
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {formatted && (
          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              Formatted JSON
            </label>
            <pre className="relative w-full h-48 p-3 bg-gray-50 border rounded-lg overflow-auto">
              <code
                dangerouslySetInnerHTML={{
                  __html: syntaxHighlight(formatted),
                }}
                className="text-sm"
              />
            </pre>
            <div className="absolute top-8 right-2 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-8 w-8 p-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JsonFormatter;