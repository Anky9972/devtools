"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const ToolCard = ({ title, description, icon, onClick }) => {
  return (
    <Card 
      onClick={onClick}
      className="transition-all duration-200 hover:shadow-lg cursor-pointer hover:-translate-y-1"
    >
      <CardHeader className="space-y-4">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <div className="text-blue-600">
            {icon}
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-gray-500">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ToolCard;