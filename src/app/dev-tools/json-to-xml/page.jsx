"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const JsonToXml = () => {
  const [json, setJson] = useState('');
  const [xml, setXml] = useState('');

  const handleConvert = () => {
    try {
      const obj = JSON.parse(json);
      const convert = (obj, name = 'root') => {
        // Handle null/undefined
        if (obj === null || obj === undefined) {
          return `<${name}/>`;
        }
        
        // Handle primitive values
        if (typeof obj !== 'object') {
          return `<${name}>${obj}</${name}>`;
        }
        
        // Handle arrays
        if (Array.isArray(obj)) {
          return obj.map(item => convert(item, name)).join('\n');
        }
        
        // Handle objects
        let xml = `<${name}`;
        const children = [];
        
        Object.entries(obj).forEach(([key, value]) => {
          if (key.startsWith('@')) {
            // Handle attributes
            xml += ` ${key.slice(1)}="${value}"`;
          } else {
            // Handle child elements
            children.push(convert(value, key));
          }
        });
        
        if (children.length > 0) {
          xml += '>\n  ' + children.join('\n  ') + `\n</${name}>`;
        } else {
          xml += '/>';
        }
        
        return xml;
      };

      setXml(convert(obj));
    } catch (error) {
      setXml(`Error: ${error.message}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>JSON to XML Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">JSON Input</label>
            <Textarea
              placeholder="Enter JSON here..."
              value={json}
              onChange={(e) => setJson(e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">XML Output</label>
            <Textarea
              value={xml}
              readOnly
              className="min-h-[300px] font-mono bg-gray-50"
            />
          </div>
        </div>
        <Button onClick={handleConvert}>Convert to XML</Button>
      </CardContent>
    </Card>
  );
};

export default JsonToXml;