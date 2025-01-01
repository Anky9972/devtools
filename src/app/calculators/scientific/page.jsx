"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ScientificCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(null);
  const [isRad, setIsRad] = useState(true);
  const [isShift, setIsShift] = useState(false);
  
  const handleNumber = (num) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op) => {
    setDisplay(prev => prev + op);
  };

  const handleEqual = () => {
    try {
      // Replace mathematical functions with JavaScript equivalents
      let expression = display
        .replace(/sin\(/g, `Math.${isRad ? 'sin' : 'sin'}(`)
        .replace(/cos\(/g, `Math.${isRad ? 'cos' : 'cos'}(`)
        .replace(/tan\(/g, `Math.${isRad ? 'tan' : 'tan'}(`)
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      // If not in radians, convert to radians before calculation
      if (!isRad) {
        expression = expression.replace(/Math\.(sin|cos|tan)\((.*?)\)/g, 
          (match, func, value) => `Math.${func}((${value}) * Math.PI / 180)`
        );
      }

      const result = eval(expression);
      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
  };

  const handleMemory = (action) => {
    switch (action) {
      case 'MS':
        setMemory(parseFloat(display));
        break;
      case 'MR':
        if (memory !== null) setDisplay(memory.toString());
        break;
      case 'MC':
        setMemory(null);
        break;
      case 'M+':
        if (memory !== null) {
          setMemory(memory + parseFloat(display));
        } else {
          setMemory(parseFloat(display));
        }
        break;
    }
  };

  const handleFunction = (func) => {
    switch (func) {
      case 'sin':
      case 'cos':
      case 'tan':
        setDisplay(prev => `${func}(${prev})`);
        break;
      case 'log':
      case 'ln':
        setDisplay(prev => `${func}(${prev})`);
        break;
      case 'sqrt':
        setDisplay(prev => `√(${prev})`);
        break;
      case 'square':
        setDisplay(prev => `(${prev})^2`);
        break;
      case 'pi':
        setDisplay(prev => prev === '0' ? 'π' : prev + 'π');
        break;
      case 'e':
        setDisplay(prev => prev === '0' ? 'e' : prev + 'e');
        break;
    }
  };

  const buttonClasses = "h-12 text-sm hover:bg-primary/90";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Scientific Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Display */}
          <div className="w-full h-16 bg-secondary/50 rounded-lg flex items-center justify-end px-4 font-mono text-2xl overflow-x-auto">
            {display}
          </div>

          {/* Mode toggles */}
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant={isRad ? "default" : "outline"}
              onClick={() => setIsRad(true)}
              className={buttonClasses}
            >
              RAD
            </Button>
            <Button 
              variant={!isRad ? "default" : "outline"}
              onClick={() => setIsRad(false)}
              className={buttonClasses}
            >
              DEG
            </Button>
            <Button 
              variant={isShift ? "default" : "outline"}
              onClick={() => setIsShift(!isShift)}
              className={buttonClasses}
            >
              SHIFT
            </Button>
          </div>

          {/* Memory functions */}
          <div className="grid grid-cols-4 gap-2">
            <Button onClick={() => handleMemory('MC')} variant="outline" className={buttonClasses}>MC</Button>
            <Button onClick={() => handleMemory('MR')} variant="outline" className={buttonClasses}>MR</Button>
            <Button onClick={() => handleMemory('MS')} variant="outline" className={buttonClasses}>MS</Button>
            <Button onClick={() => handleMemory('M+')} variant="outline" className={buttonClasses}>M+</Button>
          </div>

          {/* Scientific functions */}
          <div className="grid grid-cols-4 gap-2">
            <Button onClick={() => handleFunction('sin')} variant="outline" className={buttonClasses}>sin</Button>
            <Button onClick={() => handleFunction('cos')} variant="outline" className={buttonClasses}>cos</Button>
            <Button onClick={() => handleFunction('tan')} variant="outline" className={buttonClasses}>tan</Button>
            <Button onClick={() => handleFunction('log')} variant="outline" className={buttonClasses}>log</Button>
            <Button onClick={() => handleFunction('ln')} variant="outline" className={buttonClasses}>ln</Button>
            <Button onClick={() => handleFunction('sqrt')} variant="outline" className={buttonClasses}>√</Button>
            <Button onClick={() => handleFunction('square')} variant="outline" className={buttonClasses}>x²</Button>
            <Button onClick={() => handleOperator('^')} variant="outline" className={buttonClasses}>^</Button>
          </div>

          {/* Constants */}
          <div className="grid grid-cols-4 gap-2">
            <Button onClick={() => handleFunction('pi')} variant="outline" className={buttonClasses}>π</Button>
            <Button onClick={() => handleFunction('e')} variant="outline" className={buttonClasses}>e</Button>
            <Button onClick={() => handleOperator('(')} variant="outline" className={buttonClasses}>(</Button>
            <Button onClick={() => handleOperator(')')} variant="outline" className={buttonClasses}>)</Button>
          </div>

          {/* Numbers and basic operators */}
          <div className="grid grid-cols-4 gap-2">
            <Button onClick={() => handleNumber('7')} variant="outline" className={buttonClasses}>7</Button>
            <Button onClick={() => handleNumber('8')} variant="outline" className={buttonClasses}>8</Button>
            <Button onClick={() => handleNumber('9')} variant="outline" className={buttonClasses}>9</Button>
            <Button onClick={() => handleOperator('/')} variant="outline" className={buttonClasses}>÷</Button>
            
            <Button onClick={() => handleNumber('4')} variant="outline" className={buttonClasses}>4</Button>
            <Button onClick={() => handleNumber('5')} variant="outline" className={buttonClasses}>5</Button>
            <Button onClick={() => handleNumber('6')} variant="outline" className={buttonClasses}>6</Button>
            <Button onClick={() => handleOperator('*')} variant="outline" className={buttonClasses}>×</Button>
            
            <Button onClick={() => handleNumber('1')} variant="outline" className={buttonClasses}>1</Button>
            <Button onClick={() => handleNumber('2')} variant="outline" className={buttonClasses}>2</Button>
            <Button onClick={() => handleNumber('3')} variant="outline" className={buttonClasses}>3</Button>
            <Button onClick={() => handleOperator('-')} variant="outline" className={buttonClasses}>-</Button>
            
            <Button onClick={() => handleNumber('0')} variant="outline" className={buttonClasses}>0</Button>
            <Button onClick={() => handleNumber('.')} variant="outline" className={buttonClasses}>.</Button>
            <Button onClick={handleEqual} variant="default" className={buttonClasses}>=</Button>
            <Button onClick={() => handleOperator('+')} variant="outline" className={buttonClasses}>+</Button>
          </div>

          {/* Clear button */}
          <Button onClick={clearDisplay} variant="destructive" className="w-full">
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScientificCalculator;