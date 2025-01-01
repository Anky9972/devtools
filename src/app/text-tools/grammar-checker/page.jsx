"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  AlertCircle,
  Sparkles,
  BookOpen,
  Copy,
  RefreshCcw,
} from 'lucide-react';

const GrammarChecker = () => {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [corrections, setCorrections] = useState([]);
  const [statistics, setStatistics] = useState({
    words: 0,
    sentences: 0,
    readability: '',
    tone: '',
  });

  // Common grammar and spelling mistakes for demo
  const commonErrors = {
    'their': ['there', 'they\'re'],
    'your': ['you\'re'],
    'its': ['it\'s'],
    'affect': ['effect'],
    'accept': ['except'],
    'alot': ['a lot'],
    'could of': ['could have'],
    'would of': ['would have'],
    'should of': ['should have'],
    'loose': ['lose'],
    'whose': ['who\'s'],
    'then': ['than'],
    'to': ['too', 'two'],
  };

  // Style suggestions
  const styleChecks = {
    passive: /\b(am|is|are|was|were|being|been|be)\s+\w+ed\b/gi,
    wordiness: /\b(in order to|due to the fact that|at this point in time|in the event that)\b/gi,
    redundant: /\b(absolutely essential|advance planning|basic necessities|blend together)\b/gi,
  };

  const checkGrammar = () => {
    setIsChecking(true);
    const newCorrections = [];
    
    // Split text into words and check each
    const words = text.split(/\s+/);
    words.forEach((word, index) => {
      const cleanWord = word.toLowerCase().replace(/[.,!?]$/, '');
      
      // Check for common errors
      if (commonErrors[cleanWord]) {
        newCorrections.push({
          type: 'spelling',
          index,
          word: word,
          suggestions: commonErrors[cleanWord],
          context: words.slice(Math.max(0, index - 3), index + 4).join(' '),
        });
      }
    });

    // Check for style issues
    Object.entries(styleChecks).forEach(([type, regex]) => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        newCorrections.push({
          type: 'style',
          index: match.index,
          word: match[0],
          suggestions: [],
          context: text.slice(Math.max(0, match.index - 20), match.index + match[0].length + 20),
        });
      }
    });

    // Calculate statistics
    const stats = {
      words: words.length,
      sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
      readability: calculateReadability(text),
      tone: analyzeTone(text),
    };

    setCorrections(newCorrections);
    setStatistics(stats);
    setIsChecking(false);
  };

  const calculateReadability = (text) => {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const syllables = text.split(/\s+/).reduce((count, word) => {
      return count + countSyllables(word);
    }, 0);

    if (words === 0 || sentences === 0) return 'N/A';

    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    
    if (score > 90) return 'Very Easy';
    if (score > 80) return 'Easy';
    if (score > 70) return 'Fairly Easy';
    if (score > 60) return 'Standard';
    if (score > 50) return 'Fairly Difficult';
    if (score > 30) return 'Difficult';
    return 'Very Difficult';
  };

  const countSyllables = (word) => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  };

  const analyzeTone = (text) => {
    const formal = /\b(therefore|moreover|consequently|thus|hence|accordingly)\b/gi;
    const casual = /\b(nice|good|bad|great|awesome|cool|ok|okay|yeah)\b/gi;
    const academic = /\b(analyze|research|study|investigate|examine|conclude)\b/gi;

    const formalCount = (text.match(formal) || []).length;
    const casualCount = (text.match(casual) || []).length;
    const academicCount = (text.match(academic) || []).length;

    if (academicCount > casualCount && academicCount > formalCount) return 'Academic';
    if (formalCount > casualCount) return 'Formal';
    if (casualCount > formalCount) return 'Casual';
    return 'Neutral';
  };

  const applySuggestion = (correction, suggestion) => {
    const words = text.split(/\s+/);
    words[correction.index] = suggestion;
    setText(words.join(' '));
    checkGrammar();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Grammar & Style Checker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <textarea
              className="w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your text here to check for grammar, spelling, and style..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="flex gap-4 mb-6">
            <Button
              onClick={checkGrammar}
              disabled={!text.trim() || isChecking}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Check Text
            </Button>
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(text)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Text
            </Button>
          </div>

          <Tabs defaultValue="corrections">
            <TabsList>
              <TabsTrigger value="corrections">Corrections</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="corrections">
              <div className="space-y-4">
                {corrections.length === 0 && text && !isChecking && (
                  <Alert className="bg-green-50">
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                      No issues found in your text.
                    </AlertDescription>
                  </Alert>
                )}
                
                {corrections.map((correction, index) => (
                  <Alert
                    key={index}
                    className={correction.type === 'spelling' ? 'bg-red-50' : 'bg-yellow-50'}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <div className="flex flex-col gap-2 w-full">
                      <AlertDescription>
                        <strong>{correction.type === 'spelling' ? 'Possible error' : 'Style suggestion'}</strong>: 
                        <span className="mx-2 font-medium">{correction.word}</span>
                        in context:
                        <div className="mt-1 p-2 bg-white rounded">
                          "{correction.context}"
                        </div>
                      </AlertDescription>
                      {correction.suggestions.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {correction.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              onClick={() => applySuggestion(correction, suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Alert>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="statistics">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">Words</div>
                  <div className="text-2xl font-bold">{statistics.words}</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">Sentences</div>
                  <div className="text-2xl font-bold">{statistics.sentences}</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">Readability</div>
                  <div className="text-2xl font-bold">{statistics.readability}</div>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">Tone</div>
                  <div className="text-2xl font-bold">{statistics.tone}</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrammarChecker;