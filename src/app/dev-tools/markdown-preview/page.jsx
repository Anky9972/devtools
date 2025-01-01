"use client";
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Copy, Check, Download, Upload, RotateCcw } from 'lucide-react';

const MarkdownPreviewer = () => {
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('split');

  const sampleMarkdown = `# Welcome to Enhanced Markdown Previewer!

## Code Blocks with Syntax Highlighting

\`\`\`javascript
// Example JavaScript code
function calculateSum(a, b) {
  return a + b;
}

const result = calculateSum(10, 20);
console.log(\`The sum is: \${result}\`);
\`\`\`

\`\`\`bash
# Example bash commands
npm install react-markdown
git init
docker build -t my-app .
\`\`\`

\`\`\`python
# Python example
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
\`\`\`

## Lists

### Unordered List
- First item
  - Nested item 1
  - Nested item 2
- Second item
- Third item

### Ordered List
1. First step
2. Second step
   1. Sub-step 1
   2. Sub-step 2
3. Third step

## Tables

| Feature | Status | Description |
|---------|--------|-------------|
| Syntax Highlighting | ✅ | Code blocks with language support |
| Lists | ✅ | Ordered and unordered lists |
| Tables | ✅ | Formatted tables with alignment |

## Blockquotes

> This is a blockquote
> It can span multiple lines
>> Nested blockquotes are also supported

## Task List

- [x] Add syntax highlighting
- [x] Implement proper list styling
- [x] Add table support
- [ ] Add more features

## Text Formatting

**Bold text** and *italic text* and ~~strikethrough~~

\`inline code\` looks like this

## Links and Images

[Visit GitHub](https://github.com)
![Example Image](https://via.placeholder.com/150)
`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setMarkdown(e.target.result);
      reader.readAsText(file);
    }
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          className="rounded-md !my-4"
          showLineNumbers={true}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={`${className} bg-gray-100 rounded-md px-1`} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-5 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
    p: ({ children }) => <p className="my-3 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>,
    li: ({ children }) => <li className="ml-4">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic bg-gray-50 py-2">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-200">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 bg-gray-50 text-left text-sm font-semibold text-gray-600">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 whitespace-nowrap text-sm border-t">
        {children}
      </td>
    ),
    a: ({ children, href }) => (
      <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    img: ({ src, alt }) => (
      <img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4" />
    ),
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle>Enhanced Markdown Previewer</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMarkdown(sampleMarkdown)}
            >
              Load Example
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMarkdown('')}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="split">Split View</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className={`grid ${viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
          {/* Editor */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="w-full h-[600px] p-4 font-mono text-sm border rounded-md"
                  placeholder="Enter Markdown text..."
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 px-2"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import MD
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".md"
                  onChange={handleUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export MD
                </Button>
              </div>
            </div>
          )}
          
          {/* Preview */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className="border rounded-md p-6 h-[600px] overflow-y-auto bg-white">
              <div className="prose max-w-none">
                <ReactMarkdown components={MarkdownComponents}>{markdown}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkdownPreviewer;