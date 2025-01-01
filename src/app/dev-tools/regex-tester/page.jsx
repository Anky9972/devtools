"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle, Info, Copy, Check } from 'lucide-react';

const commonPatterns = {
  'Email': '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  'URL': 'https?:\\/\\/[\\w\\-\\.]+\\.[a-zA-Z]{2,}(\\/\\S*)?',
  'Phone (US)': '^\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$',
  'Date (YYYY-MM-DD)': '^\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\\d|3[01])$',
  'Password': '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$',
  'IPv4': '^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$'
};

const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');

  const flagOptions = [
    { value: 'g', description: 'Global - Match all occurrences' },
    { value: 'i', description: 'Case-insensitive' },
    { value: 'm', description: 'Multiline - ^ and $ match line starts/ends' },
    { value: 's', description: 'Dot matches newlines' },
    { value: 'u', description: 'Unicode support' },
    { value: 'y', description: 'Sticky matching' }
  ];

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testString]);

  const testRegex = () => {
    setError('');
    setMatches([]);
    setHighlightedText('');
    
    if (!pattern) return;

    try {
      const regex = new RegExp(pattern, flags);
      const results = [...testString.matchAll(regex)];
      setMatches(results);

      // Highlight matches in the test string
      let lastIndex = 0;
      let highlighted = '';
      for (const match of results) {
        highlighted += testString.slice(lastIndex, match.index);
        highlighted += `<span class="bg-yellow-200">${match[0]}</span>`;
        lastIndex = match.index + match[0].length;
      }
      highlighted += testString.slice(lastIndex);
      setHighlightedText(highlighted);
    } catch (err) {
      setError(err.message);
    }
  };

  const copyPattern = () => {
    navigator.clipboard.writeText(pattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const useCommonPattern = (selectedPattern) => {
    setPattern(commonPatterns[selectedPattern]);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Regex Tester
          <Select onValueChange={useCommonPattern}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Common patterns" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(commonPatterns).map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="test" className="space-y-4">
          <TabsList>
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="flags">Flags</TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex gap-2">
                  <Input
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter regex pattern..."
                    className="font-mono flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyPattern}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="Flags"
                className="w-24 font-mono"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Test String</label>
              <Textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter test string..."
                className="font-mono min-h-[100px]"
              />
            </div>

            {highlightedText && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Matches Preview</label>
                <div 
                  className="p-4 border rounded-md font-mono text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Match Details ({matches.length})</label>
              <div className="border rounded-md p-4 bg-gray-50 space-y-2">
                {matches.map((match, index) => (
                  <div key={index} className="font-mono text-sm">
                    <span className="text-gray-500">Match {index + 1}: </span>
                    <span>{JSON.stringify(match)}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="flags" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {flagOptions.map(({ value, description }) => (
                <TooltipProvider key={value}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 p-2 border rounded-md">
                        <div className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {value}
                        </div>
                        <Info className="h-4 w-4 text-gray-400" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RegexTester;