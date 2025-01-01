"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ImageOptimizer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [quality, setQuality] = useState(80);
  const [error, setError] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedImage(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptimize = async () => {
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    setIsOptimizing(true);
    try {
      // Optimization logic would go here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated optimization
      
      // Create dummy optimized file for demo
      const blob = new Blob([selectedImage], { type: selectedImage.type });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `optimized-${selectedImage.name}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error optimizing image. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Image Optimizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {preview && (
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={preview}
                alt="Preview"
                className="object-contain w-full h-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Quality: {quality}%
            </label>
            <Slider
              value={[quality]}
              onValueChange={([value]) => setQuality(value)}
              min={1}
              max={100}
              step={1}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleOptimize}
            disabled={!selectedImage || isOptimizing}
            className="w-full"
          >
            {isOptimizing ? 'Optimizing...' : 'Optimize Image'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageOptimizer;