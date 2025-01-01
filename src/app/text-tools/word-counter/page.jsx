"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Type, Hash, BookOpen } from "lucide-react";

const WordCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  const calculateStats = (text) => {
    // Remove extra whitespace and get clean text
    const cleanText = text.trim();
    
    // Calculate characters
    const characters = cleanText.length;
    const charactersNoSpaces = cleanText.replace(/\s+/g, '').length;
    
    // Calculate words
    const words = cleanText ? cleanText.split(/\s+/).filter(word => word.length > 0).length : 0;
    
    // Calculate sentences (considering multiple punctuation marks)
    const sentences = cleanText ? cleanText.split(/[.!?]+/).filter(sentence => sentence.length > 0).length : 0;
    
    // Calculate paragraphs
    const paragraphs = cleanText ? cleanText.split(/\n\s*\n/).filter(para => para.length > 0).length : 0;
    
    // Calculate reading time (assuming average reading speed of 225 words per minute)
    const readingTime = Math.ceil(words / 225);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
    };
  };

  useEffect(() => {
    const newStats = calculateStats(text);
    setStats(newStats);
  }, [text]);

  const StatCard = ({ icon: Icon, label, value, sublabel }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {sublabel && <span className="text-xs text-gray-500 mt-1">{sublabel}</span>}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Word Counter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <textarea
              className="w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Type}
              label="Words"
              value={stats.words}
            />
            <StatCard
              icon={Hash}
              label="Characters"
              value={stats.characters}
              sublabel={`${stats.charactersNoSpaces} without spaces`}
            />
            <StatCard
              icon={BookOpen}
              label="Reading Time"
              value={`${stats.readingTime} min`}
              sublabel="Based on 225 WPM"
            />
            <StatCard
              icon={Clock}
              label="Sentences"
              value={stats.sentences}
              sublabel={`${stats.paragraphs} paragraphs`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordCounter;