"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Home, FileText, Clock, Calculator, Database, Code, Type, Search } from "lucide-react";
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';

const SearchMenu = () => {
  const menuItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: FileText,
      label: "File Tools",
      children: [
        { label: "File Converter", path: "/file-tools/file-converter" },
        { label: "File Compressor", path: "/file-tools/file-compressor" },
        { label: "Image Optimizer", path: "/file-tools/image-optimizer" },
        { label: "PDF Tools", path: "/file-tools/pdf-tools" },
      ],
    },
    {
      icon: Type,
      label: "Text Tools",
      children: [
        { label: "Text Case Converter", path: "/text-tools/case-converter" },
        { label: "Grammar Checker", path: "/text-tools/grammar-checker" },
        { label: "Lorem Ipsum Generator", path: "/text-tools/lorem-ipsum" },
        { label: "Word Counter", path: "/text-tools/word-counter" },
      ],
    },
    {
      icon: Clock,
      label: "Time Tools",
      children: [
        { label: "Time Zone Converter", path: "/time-tools/timezone" },
        { label: "Date Calculator", path: "/time-tools/date-calc" },
        { label: "Countdown Timer", path: "/time-tools/countdown" },
        { label: "Meeting Planner", path: "/time-tools/meeting-planner" },
        { label: "Pomodoro Timer", path: "/time-tools/pomodoro-timer" },
      ],
    },
    {
      icon: Calculator,
      label: "Calculators",
      children: [
        { label: "Scientific Calculator", path: "/calculators/scientific" },
        { label: "Unit Converter", path: "/calculators/unit-converter" },
        { label: "Percentage Calculator", path: "/calculators/percentage" },
        { label: "Loan Calculator", path: "/calculators/loan" },
        { label: "Currency Calculator", path: "/calculators/currency" },
      ],
    },
    {
      icon: Database,
      label: "Data Tools",
      children: [
        { label: "CSV JSON", path: "/data-tools/csv-json" },
        { label: "JSON Formatter", path: "/data-tools/json-formatter" },
        { label: "Password Generator", path: "/data-tools/generate-password" },
        { label: "QR Generator", path: "/data-tools/generate-qr" },
      ],
    },
    {
      icon: Code,
      label: "Dev Tools",
      children: [
        { label: "SQL to CAML", path: "/dev-tools/sql-to-caml" },
        { label: "Hash Generator", path: "/dev-tools/hash-generator" },
        { label: "Code Beautifier", path: "/dev-tools/code-beautifier" },
        { label: "Base64 Converter", path: "/dev-tools/base64-encoder" },
        { label: "HTML To Markdown", path: "/dev-tools/html-to-markdown" },
        { label: "Markdown To HTML", path: "/dev-tools/markdown-to-html" },
        { label: "XML To JSON", path: "/dev-tools/xml-to-json" },
        { label: "JSON To XML", path: "/dev-tools/json-to-xml" },
        { label: "Markdown Previewer", path: "/dev-tools/markdown-preview" },
        { label: "Regex Tester", path: "/dev-tools/regex-tester" },
      ],
    },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  function handleNavigate(path) {
    router.push(path);
  }
  // Flatten menu items for search
  const getAllItems = useCallback(() => {
    const items = [];
    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
          items.push({
            ...child,
            category: item.label,
            icon: item.icon
          });
        });
      } else {
        items.push(item);
      }
    });
    return items;
  }, []);

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} className="text-black underline font-extrabold">{part}</span> : 
        part
    );
  };

  // Update search results
  useEffect(() => {
    if (debouncedSearchQuery) {
      const allItems = getAllItems();
      const results = allItems.filter(item => 
        item.label.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
      setSearchResults(results);
      setSelectedIndex(0);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchQuery, getAllItems]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      e.preventDefault();
      handleNavigate(searchResults[selectedIndex].path);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-10"
          aria-label="Search tools"
        />
      </div>

      {searchResults.length > 0 && (
        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg border border-gray-200 max-h-96 overflow-auto z-50">
          {searchResults.map((result, index) => (
            <div
              key={result.path}
              className={`px-4 py-2 cursor-pointer ${
                index === selectedIndex ? 'bg-gray-100' : ''
              } hover:bg-gray-100`}
              onClick={() => {
                handleNavigate(result.path);
                setSearchQuery('');
              }}
            >
              <div className="flex items-center">
                {result.icon && <result.icon className="mr-2 h-4 w-4 text-gray-500" />}
                <div>
                  <div className="text-sm font-medium">
                    {highlightMatch(result.label, debouncedSearchQuery)}
                  </div>
                  {result.category && (
                    <div className="text-xs text-gray-500">
                      {result.category}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!searchQuery === '' && (
        <nav className="mt-4">
          {menuItems.map((item) => (
            <div key={item.label} className="mb-4">
              <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-600">
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </div>
              {item.children && (
                <div className="ml-4 border-l border-gray-200">
                  {item.children.map((child) => (
                    <a
                      key={child.path}
                      href={child.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate(child.path);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </div>
  );
};

export default SearchMenu;