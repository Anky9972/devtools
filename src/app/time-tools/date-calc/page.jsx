"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock } from 'lucide-react';

const DateCalculator = () => {
  const [firstDate, setFirstDate] = useState('');
  const [secondDate, setSecondDate] = useState('');
  const [addSubtractValue, setAddSubtractValue] = useState('');
  const [addSubtractUnit, setAddSubtractUnit] = useState('days');
  const [calculationType, setCalculationType] = useState('age');
  const [result, setResult] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const calculateDifference = () => {
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);
    
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.abs((date2.getFullYear() - date1.getFullYear()) * 12 + date2.getMonth() - date1.getMonth());
    const diffYears = Math.abs(date2.getFullYear() - date1.getFullYear());

    setResult(`
      Days: ${diffDays}
      Months: ${diffMonths}
      Years: ${diffYears}
    `);
  };

  const calculateAddSubtract = () => {
    const date = new Date(firstDate);
    const value = parseInt(addSubtractValue);

    switch (addSubtractUnit) {
      case 'days':
        date.setDate(date.getDate() + value);
        break;
      case 'months':
        date.setMonth(date.getMonth() + value);
        break;
      case 'years':
        date.setFullYear(date.getFullYear() + value);
        break;
    }

    setResult(date.toLocaleDateString());
  };

  const calculateAge = () => {
    const birth = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    // Adjust for negative months or days
    if (days < 0) {
      months -= 1;
      // Get days in last month
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, birth.getDate());
      days += Math.floor((today - lastMonth) / (1000 * 60 * 60 * 24));
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Calculate next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (today > nextBirthday) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    setResult(`
      Age: ${years} years, ${months} months, ${days} days
      
      Next birthday: ${nextBirthday.toLocaleDateString()}
      Days until next birthday: ${daysUntilBirthday}
      
      Total days lived: ${Math.floor((today - birth) / (1000 * 60 * 60 * 24))}
      Total months lived: ${years * 12 + months}
    `);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Date Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Select
            value={calculationType}
            onValueChange={setCalculationType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select calculation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="age">Calculate Age</SelectItem>
              <SelectItem value="difference">Calculate Difference Between Dates</SelectItem>
              <SelectItem value="addsubtract">Add/Subtract from Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {calculationType === 'age' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Birth Date</label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <Button 
                className="w-full"
                onClick={calculateAge}
                disabled={!birthDate}
              >
                Calculate Age
              </Button>
            </>
          ) : calculationType === 'difference' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Date</label>
                  <Input
                    type="date"
                    value={firstDate}
                    onChange={(e) => setFirstDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Second Date</label>
                  <Input
                    type="date"
                    value={secondDate}
                    onChange={(e) => setSecondDate(e.target.value)}
                  />
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={calculateDifference}
                disabled={!firstDate || !secondDate}
              >
                Calculate Difference
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={firstDate}
                  onChange={(e) => setFirstDate(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value</label>
                  <Input
                    type="number"
                    value={addSubtractValue}
                    onChange={(e) => setAddSubtractValue(e.target.value)}
                    placeholder="Enter number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit</label>
                  <Select
                    value={addSubtractUnit}
                    onValueChange={setAddSubtractUnit}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                      <SelectItem value="years">Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={calculateAddSubtract}
                disabled={!firstDate || !addSubtractValue}
              >
                Calculate New Date
              </Button>
            </>
          )}
        </div>

        {result && (
          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <h3 className="font-medium mb-2">Result:</h3>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DateCalculator;