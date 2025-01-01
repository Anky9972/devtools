"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Calendar, ChartSpline, PieChart, RefreshCw } from "lucide-react";
import LoanVisualization from "../common/Visualizer";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("monthly");
  const [currency, setCurrency] = useState("USD");
  const [extraPayment, setExtraPayment] = useState("0");
  const [downPayment, setDownPayment] = useState("0");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  const frequencies = [
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "semiannual", label: "Semi-Annual" },
    { value: "annual", label: "Annual" }
  ];

  const currencies = [
    { value: "USD", label: "US Dollar ($)", symbol: "$" },
    { value: "EUR", label: "Euro (€)", symbol: "€" },
    { value: "GBP", label: "British Pound (£)", symbol: "£" },
    { value: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
    { value: "CNY", label: "Chinese Yuan (¥)", symbol: "¥" },
    { value: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
    { value: "CAD", label: "Canadian Dollar ($)", symbol: "$" },
    { value: "AUD", label: "Australian Dollar ($)", symbol: "$" },
  ];

  const validateInputs = () => {
    if (!loanAmount || !interestRate || !loanTerm) {
      setError("Please fill in all required fields");
      return false;
    }
    if (parseFloat(loanAmount) <= 0) {
      setError("Loan amount must be greater than 0");
      return false;
    }
    if (parseFloat(interestRate) <= 0) {
      setError("Interest rate must be greater than 0");
      return false;
    }
    if (parseFloat(loanTerm) <= 0) {
      setError("Loan term must be greater than 0");
      return false;
    }
    return true;
  };

  const calculateAmortizationSchedule = (payment, principal, periodicRate, totalPeriods, extraPaymentAmount) => {
    let balance = principal;
    let schedule = [];
    let currentDate = new Date(startDate);
    let totalInterest = 0;
    let actualTerm = 0;

    for (let period = 1; period <= totalPeriods && balance > 0; period++) {
      const interestPayment = balance * periodicRate;
      let principalPayment = payment - interestPayment;
      
      // Add extra payment
      principalPayment += parseFloat(extraPaymentAmount);
      
      // Ensure we don't overpay
      if (principalPayment > balance) {
        principalPayment = balance;
      }

      totalInterest += interestPayment;
      balance -= principalPayment;
      actualTerm = period;

      schedule.push({
        period,
        date: new Date(currentDate).toLocaleDateString(),
        payment: principalPayment + interestPayment,
        principalPayment,
        interestPayment,
        totalInterest,
        remainingBalance: Math.max(0, balance)
      });

      // Advance date based on payment frequency
      switch (paymentFrequency) {
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "biweekly":
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case "quarterly":
          currentDate.setMonth(currentDate.getMonth() + 3);
          break;
        case "semiannual":
          currentDate.setMonth(currentDate.getMonth() + 6);
          break;
        case "annual":
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }

    return { schedule, actualTerm };
  };

  const calculateLoan = () => {
    setError("");
    if (!validateInputs()) {
      setResult(null);
      setAmortizationSchedule([]);
      return;
    }

    try {
      const principal = parseFloat(loanAmount) - parseFloat(downPayment || 0);
      const annualRate = parseFloat(interestRate) / 100;
      const years = parseFloat(loanTerm);
      
      const periodsPerYear = {
        weekly: 52,
        biweekly: 26,
        monthly: 12,
        quarterly: 4,
        semiannual: 2,
        annual: 1
      }[paymentFrequency];
      
      const totalPeriods = years * periodsPerYear;
      const periodicRate = annualRate / periodsPerYear;
      
      const payment = (principal * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) /
                     (Math.pow(1 + periodicRate, totalPeriods) - 1);

      const { schedule, actualTerm } = calculateAmortizationSchedule(
        payment,
        principal,
        periodicRate,
        totalPeriods,
        parseFloat(extraPayment || 0)
      );

      const totalPayment = schedule.reduce((sum, period) => sum + period.payment, 0);
      const totalInterest = schedule.reduce((sum, period) => sum + period.interestPayment, 0);

      setResult({
        payment,
        totalPayment,
        totalInterest,
        periodsPerYear,
        totalPeriods,
        actualPeriods: actualTerm,
        monthlyPayment: payment * (periodsPerYear / 12),
        annualPayment: payment * periodsPerYear,
        principal,
        timesSaved: totalPeriods - actualTerm
      });

      setAmortizationSchedule(schedule);
    } catch (err) {
      setError("An error occurred during calculation");
      setResult(null);
      setAmortizationSchedule([]);
    }
  };

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, paymentFrequency, extraPayment, downPayment, startDate, currency]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Advanced Loan Calculator
        </CardTitle>
        <CardDescription className="text-center">
          Calculate loan payments, amortization schedule, and early payoff scenarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="calculator">
              <Calculator className="w-4 h-4 mr-2" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="w-4 h-4 mr-2" />
              Amortization
            </TabsTrigger>
            <TabsTrigger value="summary">
              <PieChart className="w-4 h-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="visualize">
              <ChartSpline className="w-4 h-4 mr-2" />
              Visualize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter loan amount"
                  min="0"
                  step="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="Enter down payment"
                  min="0"
                  step="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="Enter interest rate"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="Enter loan term"
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Payment Frequency</Label>
                <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="extraPayment">Extra Payment</Label>
                <Input
                  id="extraPayment"
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                  placeholder="Enter extra payment"
                  min="0"
                  step="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-primary/5 p-6 rounded-lg">
                  <p className="text-sm font-medium text-primary/70 mb-1">
                    {frequencies.find(f => f.value === paymentFrequency)?.label} Payment
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(result.payment)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Original term: {result.totalPeriods} payments
                    {result.timesSaved > 0 && (
                      <span className="text-green-600 ml-2">
                        (Save {result.timesSaved} payments with extra payment)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="schedule">
            {amortizationSchedule.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Total Interest</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amortizationSchedule.map((period) => (
                      <TableRow key={period.period}>
                        <TableCell>{period.period}</TableCell>
                        <TableCell>{period.date}</TableCell>
                        <TableCell>{formatCurrency(period.payment)}</TableCell>
                        <TableCell>{formatCurrency(period.principalPayment)}</TableCell>
                        <TableCell>{formatCurrency(period.interestPayment)}</TableCell>
                        <TableCell>{formatCurrency(period.totalInterest)}</TableCell>
                        <TableCell>{formatCurrency(period.remainingBalance)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="summary">
            {result && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                
                <div className="space-y-2">
                  <Label className="text-sm">Monthly Payment</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(result.monthlyPayment)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Annual Payment</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(result.annualPayment)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Total Payment</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(result.totalPayment)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Total Interest</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(result.totalInterest)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Actual Term</Label>
                  <p className="text-lg font-semibold">
                    {result.actualPeriods} payments
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Remaining Balance</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(result.principal)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Extra Payments</Label>
                  <p className="text-lg font-semibold">
                    {formatCurrency(parseFloat(extraPayment))}
                  </p>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setExtraPayment("0")}
                  >
                    Reset Extra Payment
                  </Button>
                </div>
              </div>

            )}
          </TabsContent>
          <TabsContent value="visualize">
            {
             ( result && amortizationSchedule.length >0)  && (
              <LoanVisualization
                amortizationData={amortizationSchedule}
                summaryData={result}
                currency={currency}
              />
             )
            }
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default LoanCalculator;