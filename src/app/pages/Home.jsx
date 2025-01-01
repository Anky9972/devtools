"use client";
import React from "react";
import ToolCard from "@/app/common/ToolCard";
import { Calculator, Clock, Code2, Database, FileText, Type } from "lucide-react";
import Layout from "../common/Layout";

const Homepage = () => {
  const tools = [
    {
      title: 'File Tools',
      description: 'Convert, optimize, and manage your files',
      icon: <FileText />,
      path: '/file-tools/file-converter'
    },
    {
      title: 'Text Tools',
      description: 'Text manipulation and formatting utilities',
      icon: <Type />,
      path: '/text-tools/word-counter'
    },
    {
      title: 'Time Tools',
      description: 'Time conversion and management tools',
      icon: <Clock />,
      path: '/time-tools/date-calc'
    },
    {
      title: 'Calculators',
      description: 'Various calculators and converters',
      icon: <Calculator />,
      path: '/calculators/loan'
    },
    {
      title: 'Data Tools',
      description: 'Data formatting and conversion utilities',
      icon: <Database />,
      path: '/data-tools/csv-json'
    },
    {
      title: 'Dev Tools',
      description: 'Developer utilities and formatters',
      icon: <Code2 />,
      path: '/dev-tools/markdown-preview'
    }
  ];

  return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome to DevTools</h1>
        <p className="text-gray-500">Select a category to get started with our tools.</p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.path}
              {...tool}
              onClick={() => window.location.href = tool.path}
            />
          ))}
        </div>
      </div>
  );
};

export default Homepage;
