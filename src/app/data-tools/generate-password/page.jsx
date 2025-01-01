"use client";
import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Shield, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    ambiguous: false,
    pronounceable: false
  });

  const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    ambiguous: 'Il1O0'
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 12) score += 25;
    if (pwd.match(/[A-Z]/)) score += 25;
    if (pwd.match(/[a-z]/)) score += 25;
    if (pwd.match(/[0-9]/)) score += 15;
    if (pwd.match(/[^A-Za-z0-9]/)) score += 10;
    return Math.min(100, score);
  };

  const getStrengthColor = () => {
    if (strength >= 80) return 'bg-green-500';
    if (strength >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const generatePassword = () => {
    let charset = '';
    let newPassword = '';
    
    if (options.pronounceable) {
      const consonants = 'bcdfghjklmnpqrstvwxyz';
      const vowels = 'aeiou';
      for (let i = 0; i < length; i++) {
        newPassword += i % 2 === 0 
          ? consonants.charAt(Math.floor(Math.random() * consonants.length))
          : vowels.charAt(Math.floor(Math.random() * vowels.length));
      }
    } else {
      Object.keys(characters).forEach(key => {
        if (options[key] && key !== 'ambiguous') {
          charset += characters[key];
        }
      });
      
      if (!options.ambiguous) {
        charset = charset.split('').filter(char => !characters.ambiguous.includes(char)).join('');
      }

      Object.keys(options).forEach(key => {
        if (options[key] && characters[key]) {
          const validChars = characters[key].split('')
            .filter(char => !characters.ambiguous.includes(char) || options.ambiguous);
          if (validChars.length) {
            newPassword += validChars[Math.floor(Math.random() * validChars.length)];
          }
        }
      });

      const remainingLength = length - newPassword.length;
      for (let i = 0; i < remainingLength; i++) {
        newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    }

    setPassword(newPassword);
    setStrength(calculateStrength(newPassword));
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptionChange = (option) => {
    const newOptions = { ...options, [option]: !options[option] };
    if (Object.values(newOptions).some(value => value)) {
      setOptions(newOptions);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Password Generator
          <Badge variant={strength >= 80 ? "success" : strength >= 60 ? "warning" : "destructive"} 
                className="ml-2">
            {strength >= 80 ? "Strong" : strength >= 60 ? "Medium" : "Weak"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            readOnly
            className="pr-24 font-mono text-lg"
          />
          <div className="absolute right-2 top-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={generatePassword}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!password}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <Progress value={strength} className={getStrengthColor()} />

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Password Length</label>
              <span className="text-sm text-gray-500">{length} characters</span>
            </div>
            <Slider
              value={[length]}
              onValueChange={([value]) => setLength(value)}
              max={32}
              min={8}
              step={1}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(options).map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={options[option]}
                  onCheckedChange={() => handleOptionChange(option)}
                />
                <label
                  htmlFor={option}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              </div>
            ))}
          </div>

          <Button
            onClick={generatePassword}
            className="w-full"
          >
            Generate New Password
          </Button>

          {strength < 60 && (
            <Alert variant="warning">
              <ShieldAlert className="w-4 h-4" />
              <AlertDescription>
                Consider increasing length or adding more character types for a stronger password
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordGenerator;