import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PercentageCalculator = () => {
  const [calculationType, setCalculationType] = useState("percentage");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculationTypes = [
    { id: "percentage", label: "What is X% of Y?", value1Label: "Percentage (X)", value2Label: "Value (Y)" },
    { id: "percentageOf", label: "X is what % of Y?", value1Label: "Value (X)", value2Label: "Total Value (Y)" },
    { id: "increase", label: "Increase X by Y%", value1Label: "Original Value (X)", value2Label: "Percentage (Y)" },
    { id: "decrease", label: "Decrease X by Y%", value1Label: "Original Value (X)", value2Label: "Percentage (Y)" }
  ];

  const calculate = () => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    setError("");

    if (isNaN(num1) || isNaN(num2)) {
      setResult(null);
      if (value1 !== "" && value2 !== "") {
        setError("Please enter valid numbers");
      }
      return;
    }

    if (calculationType === "percentageOf" && num2 === 0) {
      setError("Cannot divide by zero");
      setResult(null);
      return;
    }

    try {
      let calculatedResult;
      switch (calculationType) {
        case "percentage":
          calculatedResult = (num1 * num2) / 100;
          break;
        case "percentageOf":
          calculatedResult = (num1 / num2) * 100;
          break;
        case "increase":
          calculatedResult = num1 + (num1 * num2) / 100;
          break;
        case "decrease":
          calculatedResult = num1 - (num1 * num2) / 100;
          break;
        default:
          calculatedResult = 0;
      }

      // Check for valid result
      if (!isFinite(calculatedResult)) {
        setError("Calculation resulted in an invalid number");
        setResult(null);
        return;
      }

      setResult(calculatedResult);
    } catch (err) {
      setError("An error occurred during calculation");
      setResult(null);
    }
  };

  useEffect(() => {
    calculate();
  }, [value1, value2, calculationType]);

  const currentType = calculationTypes.find(type => type.id === calculationType);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Percentage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calculator Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="calcType">Calculation Type</Label>
          <Select value={calculationType} onValueChange={setCalculationType}>
            <SelectTrigger id="calcType" className="w-full">
              <SelectValue placeholder="Select calculation type" />
            </SelectTrigger>
            <SelectContent>
              {calculationTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Input Fields */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="value1">{currentType.value1Label}</Label>
            <Input
              id="value1"
              type="number"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              placeholder="Enter value"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value2">{currentType.value2Label}</Label>
            <Input
              id="value2"
              type="number"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              placeholder="Enter value"
              className="w-full"
            />
          </div>
        </div>

        {/* Result Display */}
        <div className="space-y-2">
          <Label className="text-lg font-semibold">Result</Label>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-center text-2xl font-bold text-primary">
              {result !== null ? result.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) : '—'}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PercentageCalculator;