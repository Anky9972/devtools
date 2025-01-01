"use client";
import React, { useState, useEffect } from 'react';
import { Clock, ArrowRightLeft, Copy } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const TimezoneConverter = () => {
  const [sourceTime, setSourceTime] = useState(new Date().toISOString().slice(0, 16));
  const [sourceTz, setSourceTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [targetTz, setTargetTz] = useState('UTC');
  const [commonTimezones, setCommonTimezones] = useState([]);
  const [showAllTimezones, setShowAllTimezones] = useState(false);

  const allTimezones = Intl.supportedValuesOf('timeZone');

  // Common timezone list
  useEffect(() => {
    const common = [
      'UTC',
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Australia/Sydney',
      'Pacific/Auckland'
    ].filter(tz => allTimezones.includes(tz));
    setCommonTimezones(common);
  }, []);

  const formatTimezoneName = (tz) => {
    return tz.replace(/_/g, ' ').replace(/\//g, ' / ');
  };

  const convertTime = () => {
    try {
      const date = new Date(sourceTime);
      
      // Format options for detailed output
      const options = {
        timeZone: targetTz,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };

      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      return 'Invalid time';
    }
  };

  const getTimeDifference = () => {
    try {
      const date = new Date();
      const sourceOffset = new Date(date.toLocaleString('en-US', { timeZone: sourceTz })).getTimezoneOffset();
      const targetOffset = new Date(date.toLocaleString('en-US', { timeZone: targetTz })).getTimezoneOffset();
      const diffInMinutes = sourceOffset - targetOffset;
      const hours = Math.abs(Math.floor(diffInMinutes / 60));
      const minutes = Math.abs(diffInMinutes % 60);
      const sign = diffInMinutes > 0 ? '-' : '+';
      return `${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const swapTimezones = () => {
    const temp = sourceTz;
    setSourceTz(targetTz);
    setTargetTz(temp);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertTime());
  };

  const getCurrentTimeInSourceTz = () => {
    setSourceTime(new Date().toISOString().slice(0, 16));
  };

  const timezoneList = showAllTimezones ? allTimezones : commonTimezones;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Timezone Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="sourceTime">Source Time</Label>
              <input
                id="sourceTime"
                type="datetime-local"
                value={sourceTime}
                onChange={(e) => setSourceTime(e.target.value)}
                className="w-full rounded-md border p-2 text-xs lg:text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={getCurrentTimeInSourceTz}
              // className="mb-0.5"
            >
              Current Time
            </Button>
          </div>
          
          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-end">
            <div className="space-y-2">
              <Label>From Timezone</Label>
              <Select value={sourceTz} onValueChange={setSourceTz}>
                <SelectTrigger>
                  <SelectValue>{formatTimezoneName(sourceTz)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {timezoneList.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {formatTimezoneName(tz)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={swapTimezones}
              className="h-10 w-10"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
            
            <div className="space-y-2">
              <Label>To Timezone</Label>
              <Select value={targetTz} onValueChange={setTargetTz}>
                <SelectTrigger>
                  <SelectValue>{formatTimezoneName(targetTz)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {timezoneList.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {formatTimezoneName(tz)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium text-gray-500">Converted Time</div>
              <div className="mt-1 text-lg font-semibold">{convertTime()}</div>
              <div className="mt-1 text-sm text-gray-500">
                Time difference: {getTimeDifference()}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="h-8 w-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowAllTimezones(!showAllTimezones)}
          className="w-full"
        >
          {showAllTimezones ? 'Show Common Timezones' : 'Show All Timezones'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TimezoneConverter;