"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload, Search, BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DataVisualizer = () => {
  const [data, setData] = useState('');
  const [fileType, setFileType] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [selectedVisualization, setSelectedVisualization] = useState('table');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  
  const COLORS = ['#4f46e5', '#ec4899', '#06b6d4', '#84cc16', '#eab308', '#ef4444'];

  useEffect(() => {
    if (data && fileType) {
      const parsed = fileType === 'csv' ? parseCSV(data) : parseJSON(data);
      setParsedData(parsed);
      setFilteredData(parsed);
      setColumns(Object.keys(parsed[0] || {}));
    }
  }, [data, fileType]);

  const parseCSV = (csvData) => {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index]?.trim();
        return obj;
      }, {});
    });
  };

  const parseJSON = (jsonData) => {
    return typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = parsedData.filter(item =>
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(term)
      )
    );
    setFilteredData(filtered);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredData(sorted);
  };

  const exportData = () => {
    let exportContent;
    if (fileType === 'csv') {
      const headers = columns.join(',');
      const rows = filteredData.map(row => 
        columns.map(col => row[col]).join(',')
      ).join('\n');
      exportContent = `${headers}\n${rows}`;
    } else {
      exportContent = JSON.stringify(filteredData, null, 2);
    }

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exported-data.${fileType}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        setFileType(fileExtension);
        setData(fileContent);
      };
      reader.readAsText(file);
    }
  };

  const handlePasteData = (e) => {
    setData(e.target.value);
  };

  const renderTable = () => (
    <div className="overflow-auto max-h-96">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead 
                key={column}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort(column)}
              >
                {column}
                {sortConfig.key === column && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={index}>
              {columns.map(column => (
                <TableCell key={column}>{row[column]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderBarChart = () => (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxis} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yAxis} fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderLineChart = () => (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxis} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={yAxis} stroke="#4f46e5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPieChart = () => (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData}
            dataKey={yAxis}
            nameKey={xAxis}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const renderScatterChart = () => (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxis} />
          <YAxis dataKey={yAxis} />
          <Tooltip />
          <Legend />
          <Scatter data={filteredData} fill="#4f46e5" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Data Visualizer</span>
          <Button onClick={exportData} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </CardTitle>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Paste or upload data..."
              value={data}
              onChange={handlePasteData}
              className="w-full"
              icon={<Search className="w-4 h-4" />}
            />
            <Button onClick={() => document.getElementById('file-upload').click()} className="mt-2">
              <Upload className="w-4 h-4" />
              Upload File
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".csv, .json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <Select value={selectedVisualization} onValueChange={setSelectedVisualization}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="scatter">Scatter Plot</SelectItem>
            </SelectContent>
          </Select>
          {selectedVisualization !== 'table' && (
            <>
              <Select value={xAxis} onValueChange={setXAxis}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="X-Axis" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={yAxis} onValueChange={setYAxis}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Y-Axis" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(column => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {selectedVisualization === 'table' && renderTable()}
        {selectedVisualization === 'bar' && renderBarChart()}
        {selectedVisualization === 'line' && renderLineChart()}
        {selectedVisualization === 'pie' && renderPieChart()}
        {selectedVisualization === 'scatter' && renderScatterChart()}
      </CardContent>
    </Card>
  );
};

export default DataVisualizer;
