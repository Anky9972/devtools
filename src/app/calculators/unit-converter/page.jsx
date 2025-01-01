"use client";
import { useState } from 'react';
import { ArrowRightLeft, Copy, History, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UnitConverter = () => {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [category, setCategory] = useState('length');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  const conversions = {
    length: {
      units: ['meters', 'feet', 'inches', 'kilometers', 'miles', 'yards', 'centimeters', 'millimeters', 'nautical miles'],
      ratios: {
        meters: 1,
        feet: 3.28084,
        inches: 39.3701,
        kilometers: 0.001,
        miles: 0.000621371,
        yards: 1.09361,
        centimeters: 100,
        millimeters: 1000,
        'nautical miles': 0.000539957
      }
    },
    weight: {
      units: ['kilograms', 'pounds', 'ounces', 'grams', 'metric tons', 'stone', 'milligrams'],
      ratios: {
        kilograms: 1,
        pounds: 2.20462,
        ounces: 35.274,
        grams: 1000,
        'metric tons': 0.001,
        stone: 0.157473,
        milligrams: 1000000
      }
    },
    temperature: {
      units: ['celsius', 'fahrenheit', 'kelvin'],
      special: true
    },
    volume: {
      units: ['liters', 'gallons', 'milliliters', 'cubic meters', 'cubic feet', 'cups', 'fluid ounces'],
      ratios: {
        liters: 1,
        gallons: 0.264172,
        milliliters: 1000,
        'cubic meters': 0.001,
        'cubic feet': 0.0353147,
        cups: 4.22675,
        'fluid ounces': 33.814
      }
    },
    area: {
      units: ['square meters', 'square feet', 'square kilometers', 'acres', 'hectares', 'square miles'],
      ratios: {
        'square meters': 1,
        'square feet': 10.7639,
        'square kilometers': 0.000001,
        'acres': 0.000247105,
        'hectares': 0.0001,
        'square miles': 3.86102e-7
      }
    }
  };

  const convert = (value, from, to) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    
    if (category === 'temperature') {
      // Handle temperature conversions separately
      if (from === to) return numValue.toFixed(2);
      if (from === 'celsius' && to === 'fahrenheit') {
        return ((numValue * 9/5) + 32).toFixed(2);
      } else if (from === 'fahrenheit' && to === 'celsius') {
        return ((numValue - 32) * 5/9).toFixed(2);
      } else if (from === 'celsius' && to === 'kelvin') {
        return (numValue + 273.15).toFixed(2);
      } else if (from === 'kelvin' && to === 'celsius') {
        return (numValue - 273.15).toFixed(2);
      } else if (from === 'fahrenheit' && to === 'kelvin') {
        return ((numValue - 32) * 5/9 + 273.15).toFixed(2);
      } else if (from === 'kelvin' && to === 'fahrenheit') {
        return ((numValue - 273.15) * 9/5 + 32).toFixed(2);
      }
      return numValue;
    }

    const ratios = conversions[category].ratios;
    const result = (numValue / ratios[from]) * ratios[to];
    return result.toFixed(4);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleConvert = () => {
    if (!value) return;
    const result = convert(value, fromUnit, toUnit);
    const newEntry = {
      id: Date.now(),
      from: { value, unit: fromUnit },
      to: { value: result, unit: toUnit },
      category
    };
    setHistory([newEntry, ...history].slice(0, 10));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatUnit = (unit) => unit.charAt(0).toUpperCase() + unit.slice(1);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Unit Converter</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Category
            </label>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setFromUnit(conversions[value].units[0]);
                setToUnit(conversions[value].units[1]);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(conversions).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {formatUnit(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {/* From Unit */}
            <div className="md:col-span-3 space-y-2">
              <label className="block text-sm font-medium">From</label>
              <Input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter value"
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conversions[category].units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {formatUnit(unit)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <Button variant="ghost" size="icon" onClick={handleSwap}>
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* To Unit */}
            <div className="md:col-span-3 space-y-2">
              <label className="block text-sm font-medium">To</label>
              <div className="relative">
                <Input
                  type="text"
                  value={convert(value, fromUnit, toUnit)}
                  readOnly
                  className="pr-10"
                  placeholder="Result"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => copyToClipboard(convert(value, fromUnit, toUnit))}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conversions[category].units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {formatUnit(unit)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Convert Button */}
          <Button className="w-full" onClick={handleConvert}>
            Convert
          </Button>

          {/* Copy Alert */}
          {copied && (
            <Alert className="mt-4">
              <AlertDescription>Copied to clipboard!</AlertDescription>
            </Alert>
          )}

          {/* Conversion History */}
          {showHistory && history.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Recent Conversions</h3>
              <div className="space-y-2">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg"
                  >
                    <span>
                      {entry.from.value} {formatUnit(entry.from.unit)} = {entry.to.value} {formatUnit(entry.to.unit)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCategory(entry.category);
                        setFromUnit(entry.from.unit);
                        setToUnit(entry.to.unit);
                        setValue(entry.from.value);
                      }}
                    >
                      <History className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitConverter;