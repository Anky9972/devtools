"use client";
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CaseConverter = () => {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const convertCase = (type) => {
    switch (type) {
      case 'upper':
        return input.toUpperCase();
      case 'lower':
        return input.toLowerCase();
      case 'title':
        return input
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      case 'sentence':
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
      default:
        return input;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Case Converter</h2>
        
        <div className="space-y-4">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type or paste your text here..."
            />
          </div>

          {/* Conversion Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'UPPERCASE', type: 'upper' },
              { label: 'lowercase', type: 'lower' },
              { label: 'Title Case', type: 'title' },
              { label: 'Sentence case', type: 'sentence' }
            ].map((option) => (
              <div key={option.type} className="relative">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">{option.label}</p>
                  <p className="text-gray-600 text-sm break-words">
                    {convertCase(option.type)}
                  </p>
                  <button
                    onClick={() => handleCopy(convertCase(option.type))}
                    className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;