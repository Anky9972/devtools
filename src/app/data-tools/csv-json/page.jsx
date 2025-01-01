"use client";
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Download, RotateCw, Copy, Upload, Table as TableIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

// Helper Functions
const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const syntaxHighlight = (json) => {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'text-purple-600'; // number
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'text-gray-800 font-medium'; // key
      } else {
        cls = 'text-green-600'; // string
      }
    } else if (/true|false/.test(match)) {
      cls = 'text-blue-600'; // boolean
    } else if (/null/.test(match)) {
      cls = 'text-gray-600'; // null
    }
    return `<span class="${cls}">${match}</span>`;
  });
};

// Component for displaying formatted JSON
const JsonDisplay = ({ json }) => {
  const highlighted = syntaxHighlight(json);
  return (
    <pre 
      className="bg-gray-50 p-4 rounded-md overflow-auto text-sm font-mono"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
};

// Component for displaying data in table format
const TableDisplay = ({ data }) => {
  if (!data || data.length === 0) return null;
  
  const headers = Object.keys(data[0]);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {headers.map((header) => (
                <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof row[header] === 'object' 
                    ? JSON.stringify(row[header]) 
                    : String(row[header] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Component
const CSVConverter = () => {
  // State management
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState('');
  const [isJsonToCsv, setIsJsonToCsv] = useState(true);
  const [delimiter, setDelimiter] = useState(',');
  const [prettify, setPrettify] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [viewMode, setViewMode] = useState('raw');
  const fileInputRef = useRef(null);

  // File handling functions
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit');
    }

    const fileType = isJsonToCsv ? 'application/json' : 'text/csv';
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validExtension = isJsonToCsv ? 'json' : 'csv';

    if (fileExtension !== validExtension) {
      throw new Error(`Invalid file type. Please upload a ${validExtension.toUpperCase()} file`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    try {
      validateFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          if (isJsonToCsv && !isValidJSON(content)) {
            throw new Error('Invalid JSON format');
          }
          setInput(content);
          setError('');
        } catch (err) {
          setError('Invalid file format: ' + err.message);
        }
      };
      reader.onerror = () => setError('Error reading file');
      reader.readAsText(file);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Conversion functions
  const parseCSVLine = (line, delimiter) => {
    const results = [];
    let field = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        results.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    
    results.push(field.trim());
    return results.map(field => field.replace(/^"|"$/g, ''));
  };

  const convertToJSON = () => {
    try {
      const lines = input.trim().split('\n').filter(Boolean);
      if (lines.length < 1) throw new Error('Invalid CSV: no data found');

      const headers = parseCSVLine(lines[0], delimiter);
      const jsonArray = lines.slice(1).map(line => {
        const values = parseCSVLine(line, delimiter);
        const obj = {};
        headers.forEach((header, index) => {
          let value = values[index] || '';
          // Try to parse numbers and booleans
          if (/^\d+$/.test(value)) value = parseInt(value);
          else if (/^\d*\.\d+$/.test(value)) value = parseFloat(value);
          else if (value.toLowerCase() === 'true') value = true;
          else if (value.toLowerCase() === 'false') value = false;
          else if (value === '') value = null;
          obj[header] = value;
        });
        return obj;
      });

      setParsedData(jsonArray);
      setOutput(prettify ? JSON.stringify(jsonArray, null, 2) : JSON.stringify(jsonArray));
      setError('');
    } catch (err) {
      setError('Invalid CSV format: ' + err.message);
      setOutput('');
      setParsedData(null);
    }
  };

  const convertToCSV = () => {
    try {
      const jsonData = JSON.parse(input);
      setParsedData(jsonData);
      
      if (!Array.isArray(jsonData)) {
        throw new Error('Input must be an array of objects');
      }

      const headers = Array.from(
        new Set(jsonData.flatMap(obj => Object.keys(obj)))
      );

      const csvRows = [
        headers.join(delimiter),
        ...jsonData.map(row =>
          headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') {
              return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            }
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(delimiter)
        ),
      ];

      setOutput(csvRows.join('\n'));
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
      setParsedData(null);
    }
  };

  // Utility functions
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([output], {
      type: isJsonToCsv ? 'text/csv' : 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isJsonToCsv ? 'converted.csv' : 'converted.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Render component
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>JSON ↔ CSV Converter</span>
          <div className="flex items-center gap-2">
            <Select value={delimiter} onValueChange={setDelimiter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Delimiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Comma (,)</SelectItem>
                <SelectItem value=";">Semicolon (;)</SelectItem>
                <SelectItem value="\t">Tab</SelectItem>
                <SelectItem value="|">Pipe (|)</SelectItem>
              </SelectContent>
            </Select>
            {!isJsonToCsv && (
              <Button variant="ghost" size="sm" onClick={() => setPrettify(!prettify)}>
                <Settings className="h-4 w-4 mr-2" />
                {prettify ? 'Minify' : 'Prettify'}
              </Button>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          {isJsonToCsv ? 'Convert JSON array to CSV format' : 'Convert CSV to JSON array'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className={`relative rounded-md border-2 border-dashed transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Textarea
            placeholder={`Paste your ${isJsonToCsv ? 'JSON' : 'CSV'} here or drag & drop a file...`}
            className="h-48 border-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={isJsonToCsv ? '.json' : '.csv'}
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={isJsonToCsv ? convertToCSV : convertToJSON}>
            <RotateCw className="h-4 w-4 mr-2" />
            Convert to {isJsonToCsv ? 'CSV' : 'JSON'}
          </Button>
          
          {output && (
            <>
              <Button onClick={downloadOutput} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            onClick={() => {
              setIsJsonToCsv((prev) => !prev);
              setInput('');
              setOutput('');
              setError('');
              setParsedData(null);
              setViewMode('raw');
            }}
          >
            Switch to {isJsonToCsv ? 'CSV to JSON' : 'JSON to CSV'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {output && (
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
            <TabsList>
              <TabsTrigger value="raw">Raw</TabsTrigger>
              {!isJsonToCsv && <TabsTrigger value="formatted">Formatted</TabsTrigger>}
              {parsedData && <TabsTrigger value="table">Table</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="raw">
              <Textarea className="h-48 font-mono" value={output} readOnly />
            </TabsContent>
            
            {!isJsonToCsv && (
              <TabsContent value="formatted">
                <div className="border rounded-md">
                  <JsonDisplay json={output} />
                </div>
              </TabsContent>
            )}
            
            {parsedData && (
              <TabsContent value="table">
                <TableDisplay data={parsedData} />
              </TabsContent>
            )}
          </Tabs>
        )}
      </CardContent>
      <CardContent className="text-sm text-gray-500">
        <p className="mb-2">Note: This tool supports JSON arrays and CSV data with headers.</p>
        <p>For CSV data, the first row should contain the column headers.</p>
      </CardContent>
    </Card>
  );
}

export default CSVConverter;
 
//  In this component, we have a form with a  Textarea  input where users can paste their JSON or CSV data. We also have a file upload input that accepts either JSON or CSV files. When the user pastes data or uploads a file, we read the content and validate it. If the data is valid, we set it as the input value. 
//  The user can then convert the data between JSON and CSV formats by clicking the "Convert to CSV" or "Convert to JSON" button. The converted data is displayed in a  Textarea  input, and the user can download it as a file or copy it to the clipboard. 
//  We also have a  Select  input for selecting the delimiter character for CSV data. The user can choose between a comma, semicolon, tab, or pipe character. 
//  We use the  Tabs  component to display the output in different views: raw, formatted JSON, and a table view for JSON data. The table view is only available when converting JSON to CSV. 
//  The  JsonDisplay  and  TableDisplay  components are used to render the JSON data in a formatted way and as a table, respectively. 
//  To run the application, start the development server by running the following command: 
//  npm run dev
 
//  Open your browser and navigate to  http://localhost:3000  to view the JSON to CSV converter tool. 
//  Conclusion 
//  In this tutorial, we built a JSON to CSV converter tool using React and Tailwind CSS. We created a form where users can paste JSON or CSV data or upload a file. The user can convert the data between JSON and CSV formats and view the output in raw, formatted JSON, or table format. 
//  We used the  FileReader  API to read file content and validate it before converting the data. We also used the  navigator.clipboard  API to copy the output to the clipboard and the  Blob  API to download the output as a file. 
//  The complete source code for this project is available on  GitHub. 
//  Happy coding! 
//  Peer Review Contributions by:  Saiharsha Balasubramaniam