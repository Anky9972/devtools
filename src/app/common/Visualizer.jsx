import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const LoanVisualization = ({ summaryData, amortizationData, currency = 'INR' }) => {
  // Transform summary data for total cost breakdown
  const transformedSummaryData = React.useMemo(() => [
    { name: 'Principal', value: summaryData?.principal || 0 },
    { name: 'Total Interest', value: summaryData?.totalInterest || 0 }
  ], [summaryData]);

  // Transform first month data for monthly payment breakdown
  const monthlyBreakdown = React.useMemo(() => {
    if (!amortizationData?.[0]) return [];
    return [
      { name: 'Principal', value: amortizationData[0].principalPayment },
      { name: 'Interest', value: amortizationData[0].interestPayment }
    ];
  }, [amortizationData]);

  // Transform amortization data for charts
  const transformedAmortizationData = React.useMemo(() => {
    if (!Array.isArray(amortizationData)) return [];
    return amortizationData.map(item => ({
      month: item.date,
      payment: item.payment,
      principal: item.principalPayment,
      interest: item.interestPayment,
      balance: item.remainingBalance
    }));
  }, [amortizationData]);

  // Format currency
  const formatCurrency = React.useCallback((value) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
      }).format(value);
    } catch (e) {
      return `${currency} ${Number(value).toFixed(0)}`;
    }
  }, [currency]);

  // Colors for the charts
  const COLORS = ['#4f46e5', '#ec4899', '#06b6d4', '#84cc16'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Total Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transformedSummaryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {transformedSummaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Payment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={monthlyBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {monthlyBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Amortization Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Amortization Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="breakdown">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="breakdown">Payment Breakdown</TabsTrigger>
              <TabsTrigger value="balance">Balance Over Time</TabsTrigger>
            </TabsList>
            
            <TabsContent value="breakdown">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={transformedAmortizationData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="principal" stackId="a" fill={COLORS[0]} name="Principal" />
                    <Bar dataKey="interest" stackId="a" fill={COLORS[1]} name="Interest" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="balance">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={transformedAmortizationData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="balance" 
                      stroke={COLORS[2]} 
                      fill={COLORS[2]} 
                      name="Remaining Balance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanVisualization;