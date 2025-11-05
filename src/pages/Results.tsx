import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBiomarkerStore } from "@/store/biomarkerStore";
import {
  evaluateBiomarker,
  BiomarkerResult,
} from "@/utils/biomarkerEvaluation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Results = () => {
  const navigate = useNavigate();
  const { biomarkerData } = useBiomarkerStore();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<BiomarkerResult[]>([]);

  useEffect(() => {
    if (!biomarkerData) {
      navigate("/dashboard");
      return;
    }

    // Simulate loading for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [biomarkerData, navigate]);

  useEffect(() => {
    if (!biomarkerData) return;

    const evaluatedResults: BiomarkerResult[] = [];

    Object.entries(biomarkerData).forEach(([key, value]) => {
      const result = evaluateBiomarker(key, value, "CBC");
      if (result) evaluatedResults.push(result);
    });

    setResults(evaluatedResults);
  }, [biomarkerData]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; emoji: string }> = {
      optimal: { className: "bg-health-optimal text-black", emoji: "✅" },
      suboptimal: { className: "bg-health-suboptimal text-black", emoji: "⚠️" },
      critical: { className: "bg-health-critical text-black", emoji: "🔴" },
    };
    const config = variants[status] || variants.critical;
    return <Badge className={config.className}>{config.emoji}</Badge>;
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, BiomarkerResult[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-health-bg-start via-health-bg-mid to-health-bg-end">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Analyzing Your Results
            </h2>
            <p className="text-muted-foreground">
              Processing your biomarker data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-bg-start via-health-bg-mid to-health-bg-end py-12 mb-20">
      <div className="container mx-auto  space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="gap-2 hover:bg-[var(--main-blue)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Your Biomarker Results
          </h1>
          <p className="text-muted-foreground">
            Review your lab results and health insights
          </p>
        </div>

        {Object.entries(groupedResults).map(([category, categoryResults]) => (
          <Card key={category} className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">
                {category === "CBC" && "🩸 Complete Blood Count (CBC)"}
                {category === "CMP" && "⚖️ Comprehensive Metabolic Panel (CMP)"}
                {category === "Lipid Panel" && "❤️ Lipid Panel"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Biomarker</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Optimal Range</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryResults.map((result) => (
                    <TableRow key={result.name}>
                      <TableCell className="font-medium">
                        {result.name}
                      </TableCell>
                      <TableCell>
                        {result.value} {result.unit}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {result.range} {result.unit}
                      </TableCell>
                      <TableCell>{getStatusBadge(result.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Results;
