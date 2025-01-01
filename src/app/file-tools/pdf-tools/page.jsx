"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PdfTools = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.some(file => !file.type.includes('pdf'))) {
      setError('Please select only PDF files');
      return;
    }
    setSelectedFiles(files);
    setError('');
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    try {
      // Merge logic would go here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated processing
      
      // Create dummy merged file for demo
      const blob = new Blob(['Merged PDF content'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error merging PDFs. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplit = async () => {
    if (selectedFiles.length !== 1) {
      setError('Please select one PDF file to split');
      return;
    }

    setIsProcessing(true);
    try {
      // Split logic would go here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated processing
      
      // Create dummy split files for demo
      ['part1.pdf', 'part2.pdf'].forEach(filename => {
        const blob = new Blob(['Split PDF content'], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      });
    } catch (err) {
      setError('Error splitting PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>PDF Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="merge">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="merge">Merge PDFs</TabsTrigger>
            <TabsTrigger value="split">Split PDF</TabsTrigger>
          </TabsList>
          
          <TabsContent value="merge">
            <div className="space-y-4">
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              
              {selectedFiles.length > 0 && (
                <div className="text-sm">
                  Selected files: {selectedFiles.map(f => f.name).join(', ')}
                </div>
              )}

              <Button 
                onClick={handleMerge}
                disabled={selectedFiles.length < 2 || isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Merging...' : 'Merge PDFs'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="split">
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />

              {selectedFiles.length === 1 && (
                <div className="text-sm">
                  Selected file: {selectedFiles[0].name}
                </div>
              )}

              <Button 
                onClick={handleSplit}
                disabled={selectedFiles.length !== 1 || isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Splitting...' : 'Split PDF'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PdfTools;