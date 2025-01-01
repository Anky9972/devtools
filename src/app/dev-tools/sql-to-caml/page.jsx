"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Trash, AlertCircle, ClipboardCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SqlToCaml = () => {
  const [sql, setSql] = useState('');
  const [caml, setCaml] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState({ sql: false, caml: false });

  const convertToCaml = () => {
    try {
      setError('');
      let result = sql.trim();
      
      if (!result.toLowerCase().includes('where')) {
        throw new Error('Query must include a WHERE clause');
      }

      result = result.replace(/SELECT.*?FROM.*?WHERE/i, '').trim();
      
      const operatorMap = {
        '=': 'Eq',
        '<>': 'Neq',
        '>': 'Gt',
        '<': 'Lt',
        '>=': 'Geq',
        '<=': 'Leq',
        'LIKE': 'Contains',
        'IS NULL': 'IsNull',
        'IS NOT NULL': 'IsNotNull'
      };

      let conditions = result.split(/\b(AND|OR)\b/i);
      let camlQuery = '<Query>\n  <Where>\n';
      
      if (conditions.length > 1) {
        const operator = conditions[1].trim().toUpperCase();
        camlQuery += `    <${operator}>\n`;
      }

      conditions.filter((c, i) => i % 2 === 0).forEach(condition => {
        condition = condition.trim();
        if (!condition) return;

        let [field, operator, ...valueParts] = condition.split(/\s+/);
        let value = valueParts.join(' ').replace(/['"`]/g, '');
        
        if (!field || !operator) {
          throw new Error('Invalid condition format');
        }
        
        const camlOperator = operatorMap[operator.toUpperCase()] || operator;
        
        camlQuery += `      <${camlOperator}>\n`;
        camlQuery += `        <FieldRef Name="${field}"/>\n`;
        camlQuery += `        <Value Type="Text">${value}</Value>\n`;
        camlQuery += `      </${camlOperator}>\n`;
      });

      if (conditions.length > 1) {
        const operator = conditions[1].trim().toUpperCase();
        camlQuery += `    </${operator}>\n`;
      }

      camlQuery += '  </Where>\n</Query>';
      setCaml(camlQuery);
    } catch (error) {
      setError(error.message);
      setCaml('');
    }
  };

  const handleCopy = (type) => {
    const text = type === 'sql' ? sql : caml;
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>SQL to SharePoint CAML Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">SQL Query</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy('sql')}
              >
                {copied.sql ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="relative rounded-md overflow-hidden">
              <textarea
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                className="w-full min-h-[400px] p-4 font-mono text-sm bg-slate-900 text-blue-400 resize-none focus:ring-2 focus:ring-blue-500 border-none"
                placeholder="Enter SQL WHERE clause..."
                spellCheck="false"
                style={{ lineHeight: '1.5', caretColor: 'white' }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">CAML Query</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy('caml')}
                disabled={!caml}
              >
                {copied.caml ? <ClipboardCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="relative rounded-md overflow-hidden">
              <textarea
                value={caml}
                readOnly
                className="w-full min-h-[400px] p-4 font-mono text-sm bg-slate-900 text-green-400 resize-none border-none"
                spellCheck="false"
                style={{ lineHeight: '1.5' }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={convertToCaml}>Convert to CAML</Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setSql('');
              setCaml('');
              setError('');
            }}
          >
            <Trash className="w-4 h-4 mr-2" /> Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SqlToCaml;