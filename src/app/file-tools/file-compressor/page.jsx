"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FileSizeReducer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isReducing, setIsReducing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState('medium');

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError('File size must be less than 100MB');
        return;
      }
      setSelectedFile(file);
      setError('');
      setProgress(0);
    }
  };

  const handleReduce = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsReducing(true);
    setProgress(0);

    try {
      // Simulated file reduction process with progress updates
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      // Create dummy reduced file for demo
      const blob = new Blob([selectedFile], { type: selectedFile.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reduced-${selectedFile.name}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error reducing file size. Please try again.');
    } finally {
      setIsReducing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>File Size Reducer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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

          {selectedFile && (
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">File name:</span> {selectedFile.name}
              </div>
              <div className="text-sm">
                <span className="font-medium">Original size:</span> {formatFileSize(selectedFile.size)}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Compression Level</label>
            <Select 
              value={compressionLevel} 
              onValueChange={setCompressionLevel}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Better Quality</SelectItem>
                <SelectItem value="medium">Medium - Balanced</SelectItem>
                <SelectItem value="high">High - Smaller Size</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isReducing && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-center">{progress}% complete</p>
            </div>
          )}

          <Button 
            onClick={handleReduce}
            disabled={!selectedFile || isReducing}
            className="w-full"
          >
            {isReducing ? 'Reducing...' : 'Reduce File Size'}
          </Button>

          <div className="text-sm text-gray-500">
            <h3 className="font-medium mb-2">Supported file types:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Images (JPG, PNG, GIF, WebP)</li>
              <li>Documents (PDF, DOCX, PPTX)</li>
              <li>Videos (MP4, MOV)</li>
              <li>Audio (MP3, WAV)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileSizeReducer;