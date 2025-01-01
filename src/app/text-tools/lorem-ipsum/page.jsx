"use client";
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoremIpsumGenerator = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [copied, setCopied] = useState(false);

  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
    'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui',
    'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateParagraph = (wordCount) => {
    let paragraph = '';
    for (let i = 0; i < wordCount; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      paragraph += (i === 0 ? randomWord.charAt(0).toUpperCase() + randomWord.slice(1) : randomWord);
      paragraph += (i === wordCount - 1 ? '.' : ' ');
    }
    return paragraph;
  };

  const generateText = () => {
    const text = [];
    for (let i = 0; i < paragraphs; i++) {
      text.push(generateParagraph(wordsPerParagraph));
    }
    return text;
  };

  const handleCopy = async () => {
    const text = generatedText.join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatedText = generateText();

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Lorem Ipsum Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="paragraphs">Number of Paragraphs</Label>
                <Input
                  id="paragraphs"
                  type="number"
                  min="1"
                  max="10"
                  value={paragraphs}
                  onChange={(e) => setParagraphs(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="words">Words per Paragraph</Label>
                <Input
                  id="words"
                  type="number"
                  min="10"
                  max="100"
                  value={wordsPerParagraph}
                  onChange={(e) => setWordsPerParagraph(Math.min(100, Math.max(10, parseInt(e.target.value) || 10)))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute right-2 top-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-md min-h-64 mt-2">
                {generatedText.map((paragraph, index) => (
                  <p key={index} className={index < generatedText.length - 1 ? "mb-4" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {copied && (
              <Alert className="bg-green-50">
                <AlertDescription>
                  Text copied to clipboard successfully!
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoremIpsumGenerator;