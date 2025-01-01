"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MeetingPlanner = () => {
  const [participants, setParticipants] = useState([
    { name: 'You', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, 
      startHour: 9, endHour: 17, daysAvailable: ['1', '2', '3', '4', '5'] }
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState(60); // minutes
  
  const timezones = Intl.supportedValuesOf('timeZone');
  const workingHours = Array.from({ length: 24 }, (_, i) => i);
  const daysOfWeek = [
    { value: '0', label: 'Sun' },
    { value: '1', label: 'Mon' },
    { value: '2', label: 'Tue' },
    { value: '3', label: 'Wed' },
    { value: '4', label: 'Thu' },
    { value: '5', label: 'Fri' },
    { value: '6', label: 'Sat' },
  ];

  const addParticipant = () => {
    setParticipants([...participants, { 
      name: `Participant ${participants.length + 1}`, 
      timezone: 'UTC',
      startHour: 9,
      endHour: 17,
      daysAvailable: ['1', '2', '3', '4', '5']
    }]);
  };

  const removeParticipant = (index) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index] = { ...newParticipants[index], [field]: value };
    setParticipants(newParticipants);
  };

  const formatTime = (hour, minute = 0) => {
    return new Date(0, 0, 0, hour, minute).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getSuggestedTimes = () => {
    const selectedDay = new Date(selectedDate).getDay().toString();
    const suggestions = [];
    const intervals = Math.floor(duration / 30);
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        let isValidTime = true;
        
        for (const participant of participants) {
          if (!participant.daysAvailable.includes(selectedDay)) {
            isValidTime = false;
            break;
          }

          const localTime = new Date(`${selectedDate}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`);
          const participantTime = new Date(localTime.toLocaleString('en-US', { timeZone: participant.timezone }));
          const participantHour = participantTime.getHours();
          const participantMinute = participantTime.getMinutes();
          
          // Check if meeting ends within working hours
          const meetingEndTime = new Date(participantTime);
          meetingEndTime.setMinutes(participantMinute + duration);
          
          if (participantHour < participant.startHour || 
              participantHour > participant.endHour ||
              (meetingEndTime.getHours() > participant.endHour) ||
              (meetingEndTime.getHours() === participant.endHour && meetingEndTime.getMinutes() > 0)) {
            isValidTime = false;
            break;
          }
        }

        if (isValidTime) {
          suggestions.push({ hour, minute });
        }
      }
    }

    return suggestions;
  };

  const getLocalTime = (utcHour, utcMinute, timezone) => {
    const date = new Date(`${selectedDate}T${utcHour.toString().padStart(2, '0')}:${utcMinute.toString().padStart(2, '0')}:00Z`);
    return date.toLocaleTimeString('en-US', { 
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Meeting Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Meeting Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className='text-xs lg:text-base'
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[15, 30, 45, 60, 90, 120].map((mins) => (
                  <SelectItem key={mins} value={mins}>
                    {mins} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Participants</h3>
            <Button onClick={addParticipant} size="sm">
              <Users className="mr-2 h-4 w-4" />
              Add Participant
            </Button>
          </div>

          {participants.map((participant, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={participant.name}
                      onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select 
                      value={participant.timezone}
                      onValueChange={(value) => updateParticipant(index, 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue>{participant.timezone}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Working Hours</Label>
                    <div className="flex flex-col lg:flex-row items-center gap-2">
                      <Select 
                        value={participant.startHour}
                        onValueChange={(value) => updateParticipant(index, 'startHour', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue>{formatTime(participant.startHour)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {workingHours.map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {formatTime(hour)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span>to</span>
                      <Select 
                        value={participant.endHour}
                        onValueChange={(value) => updateParticipant(index, 'endHour', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue>{formatTime(participant.endHour)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {workingHours.map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {formatTime(hour)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Available Days</Label>
                    <Select 
                      value={participant.daysAvailable}
                      onValueChange={(value) => updateParticipant(index, 'daysAvailable', value)}
                      multiple
                    >
                      <SelectTrigger>
                        <SelectValue>
                          {participant.daysAvailable.length} days selected
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day.value} value={day.value}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {index !== 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeParticipant(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-secondary">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Suggested Meeting Times</h3>
            <div className="space-y-3">
              {getSuggestedTimes().length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No suitable meeting times found. Try adjusting working hours or selecting a different date.
                  </AlertDescription>
                </Alert>
              ) : (
                getSuggestedTimes().map(({ hour, minute }) => (
                  <div key={`${hour}-${minute}`} className="bg-background rounded-lg p-4">
                    <div className="font-medium mb-2">
                      {formatTime(hour, minute)} UTC
                    </div>
                    <div className="text-sm space-y-1">
                      {participants.map((participant, index) => (
                        <div key={index} className="text-muted-foreground">
                          {participant.name}: {getLocalTime(hour, minute, participant.timezone)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default MeetingPlanner;