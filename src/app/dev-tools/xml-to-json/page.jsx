"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const XmlToJson = () => {
  const [xml, setXml] = useState('');
  const [json, setJson] = useState('');

  const xmlToJson = (xml) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');
      
      const convert = (node) => {
        const obj = {};
        
        // Handle attributes
        if (node.attributes) {
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            obj[`@${attr.nodeName}`] = attr.nodeValue;
          }
        }
        
        // Handle child nodes
        if (node.hasChildNodes()) {
          const children = {};
          
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            
            if (child.nodeType === 1) { // Element node
              const childResult = convert(child);
              
              if (children[child.nodeName]) {
                if (!Array.isArray(children[child.nodeName])) {
                  children[child.nodeName] = [children[child.nodeName]];
                }
                children[child.nodeName].push(childResult);
              } else {
                children[child.nodeName] = childResult;
              }
            } else if (child.nodeType === 3 && child.nodeValue.trim()) { // Text node
              return child.nodeValue.trim();
            }
          }
          
          Object.assign(obj, children);
        }
        
        return obj;
      };

      const result = convert(xmlDoc.documentElement);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      return `Error: ${error.message}`;
    }
  };

  const handleConvert = () => {
    const result = xmlToJson(xml);
    setJson(result);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>XML to JSON Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">XML Input</label>
            <Textarea
              placeholder="Enter XML here..."
              value={xml}
              onChange={(e) => setXml(e.target.value)}
              className="min-h-[300px] font-mono"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">JSON Output</label>
            <Textarea
              value={json}
              readOnly
              className="min-h-[300px] font-mono bg-gray-50"
            />
          </div>
        </div>
        <Button onClick={handleConvert}>Convert to JSON</Button>
      </CardContent>
    </Card>
  );
};

export default XmlToJson;