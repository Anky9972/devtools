"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Star, History, TrendingUp, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [favorites, setFavorites] = useState([]);
  const [conversionHistory, setConversionHistory] = useState([]);
  const [lastUpdate] = useState(new Date().toLocaleString());

  const exchangeRates = {
    USD: { EUR: 0.91, GBP: 0.79, JPY: 149.50, CAD: 1.35, AUD: 1.52, CNY: 7.20 },
    EUR: { USD: 1.10, GBP: 0.86, JPY: 164.23, CAD: 1.48, AUD: 1.67, CNY: 7.91 },
    GBP: { USD: 1.27, EUR: 1.16, JPY: 190.97, CAD: 1.72, AUD: 1.94, CNY: 9.19 },
    JPY: { USD: 0.0067, EUR: 0.0061, GBP: 0.0052, CAD: 0.0090, AUD: 0.0102, CNY: 0.048 },
    CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 110.74, AUD: 1.13, CNY: 5.34 },
    AUD: { USD: 0.66, EUR: 0.60, GBP: 0.52, JPY: 98.36, CAD: 0.89, CNY: 4.74 },
    CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 20.76, CAD: 0.19, AUD: 0.21 }
  };

  const convertCurrency = () => {
    if (!amount) return 0;
    const rate = exchangeRates[fromCurrency][toCurrency];
    const result = (parseFloat(amount) * rate).toFixed(2);
    
    if (amount) {
      const conversion = {
        from: fromCurrency,
        to: toCurrency,
        amount: amount,
        result: result,
        timestamp: new Date().toLocaleString()
      };
      setConversionHistory([conversion, ...conversionHistory.slice(0, 9)]);
    }
    
    return result;
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const toggleFavorite = (from, to) => {
    const pair = `${from}-${to}`;
    if (favorites.includes(pair)) {
      setFavorites(favorites.filter(f => f !== pair));
    } else {
      setFavorites([...favorites, pair]);
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Currency Converter
          </span>
          <span className="text-sm font-normal text-gray-500">
            Last updated: {lastUpdate}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="converter" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="converter">Converter</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="space-y-6">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-lg"
            />

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(exchangeRates).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" size="icon" onClick={swapCurrencies}>
                <ArrowRightLeft className="w-5 h-5" />
              </Button>

              <div className="flex-1">
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(exchangeRates).map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(fromCurrency, toCurrency)}
              >
                <Star
                  className={`w-5 h-5 ${
                    favorites.includes(`${fromCurrency}-${toCurrency}`)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              </Button>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <p className="text-sm text-gray-600">Converted Amount</p>
              <p className="text-3xl font-bold">
                {amount ? formatCurrency(convertCurrency(), toCurrency) : '0.00'}
              </p>
              <p className="text-sm text-gray-500">
                1 {fromCurrency} = {exchangeRates[fromCurrency][toCurrency]} {toCurrency}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="space-y-4">
              {favorites.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No favorite pairs yet. Click the star icon to add pairs.
                </p>
              ) : (
                favorites.map(pair => {
                  const [from, to] = pair.split('-');
                  return (
                    <div key={pair} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span>
                        {from} → {to}
                      </span>
                      <span className="text-gray-600">
                        1 {from} = {exchangeRates[from][to]} {to}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {conversionHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No conversion history yet.
                </p>
              ) : (
                conversionHistory.map((conversion, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{conversion.timestamp}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAmount(conversion.amount);
                          setFromCurrency(conversion.from);
                          setToCurrency(conversion.to);
                        }}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    <p>
                      {formatCurrency(conversion.amount, conversion.from)} →{' '}
                      {formatCurrency(conversion.result, conversion.to)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;