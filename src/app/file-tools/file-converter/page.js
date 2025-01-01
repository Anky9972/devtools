"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FileConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [error, setError] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const supportedFormats = {
    'document': ['pdf', 'docx', 'txt'],
    'image': ['jpg', 'png', 'webp'],
    'spreadsheet': ['xlsx', 'csv']
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleConvert = async () => {
    if (!selectedFile || !targetFormat) {
      setError('Please select a file and target format');
      return;
    }

    setIsConverting(true);
    try {
      // Conversion logic would go here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated conversion
      
      // Create dummy converted file for demo
      const blob = new Blob(['Converted file content'], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted-file.${targetFormat}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error converting file. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>File Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(supportedFormats).map(([category, formats]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-medium capitalize">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {formats.map(format => (
                    <Button
                      key={format}
                      variant={targetFormat === format ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTargetFormat(format)}
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleConvert}
            disabled={!selectedFile || !targetFormat || isConverting}
            className="w-full"
          >
            {isConverting ? 'Converting...' : 'Convert File'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileConverter;