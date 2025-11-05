import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const API_URL = "https://health-api-e3d6.onrender.com";

type PanelData = Record<string, number | string>;

type UserResponse = {
  username: string;
  email: string;
  userBloodPanel?: PanelData;
  userLipidPanel?: PanelData;
  metabolicPanel?: PanelData;
};

// Simple evaluation logic (you can expand ranges easily)
const evaluateBiomarker = (
  key: string,
  value: number | string
): { range: string; status: "optimal" | "suboptimal" | "critical" } => {
  const numeric = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(numeric)) return { range: "-", status: "suboptimal" };

  const rules: Record<string, { range: string; min: number; max: number }> = {
    hemoglobin: { range: "13.5–17.5 g/dL", min: 13.5, max: 17.5 },
    wbc: { range: "4.0–11.0 x10⁹/L", min: 4, max: 11 },
    platelets: { range: "150–450 x10⁹/L", min: 150, max: 450 },
    rbc: { range: "4.5–5.9 x10⁶/µL", min: 4.5, max: 5.9 },
    hematocrit: { range: "41–53%", min: 41, max: 53 },
    totalCholesterol: { range: "<200 mg/dL", min: 0, max: 200 },
    ldl: { range: "<130 mg/dL", min: 0, max: 130 },
    hdl: { range: ">40 mg/dL", min: 40, max: 100 },
    triglycerides: { range: "<150 mg/dL", min: 0, max: 150 },
    glucose: { range: "70–99 mg/dL", min: 70, max: 99 },
    calcium: { range: "8.6–10.2 mg/dL", min: 8.6, max: 10.2 },
    sodium: { range: "135–145 mmol/L", min: 135, max: 145 },
    potassium: { range: "3.5–5.0 mmol/L", min: 3.5, max: 5.0 },
    creatinine: { range: "0.7–1.3 mg/dL", min: 0.7, max: 1.3 },
    eGFR: { range: ">60 mL/min", min: 60, max: 120 },
    alt: { range: "7–56 U/L", min: 7, max: 56 },
    albumin: { range: "3.4–5.4 g/dL", min: 3.4, max: 5.4 },
  };

  const rule = rules[key];
  if (!rule) return { range: "-", status: "suboptimal" };

  if (numeric < rule.min * 0.9 || numeric > rule.max * 1.1)
    return { range: rule.range, status: "critical" };
  if (numeric < rule.min || numeric > rule.max)
    return { range: rule.range, status: "suboptimal" };
  return { range: rule.range, status: "optimal" };
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, { className: string; emoji: string }> = {
    optimal: { className: "bg-health-optimal text-black", emoji: "✅" },
    suboptimal: { className: "bg-health-suboptimal text-black", emoji: "⚠️" },
    critical: { className: "bg-health-critical text-black", emoji: "🔴" },
  };
  const config = variants[status] || variants.suboptimal;
  return <Badge className={config.className}>{config.emoji}</Badge>;
};

export default function LatestResultSection() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in again.");

        const res = await fetch(`${API_URL}/api/Users/GetUserInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-health-bg-start via-health-bg-mid to-health-bg-end">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Loading Your Results
            </h2>
            <p className="text-muted-foreground">
              Fetching your latest health data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-2">
        <p className="text-red-500 font-semibold">{error}</p>
        <p className="text-muted-foreground">
          Try refreshing or logging in again.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
        No data found.
      </div>
    );
  }

  // Helper to render each panel
  const renderPanel = (title: string, icon: string, panel?: PanelData) => {
    if (!panel) return null;

    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-2xl">
            {icon} {title}
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
              {Object.entries(panel)
                .filter(([key]) => key !== "createdAt")
                .map(([key, value]) => {
                  const evaluation = evaluateBiomarker(key, value);
                  return (
                    <TableRow key={key}>
                      <TableCell className="capitalize">{key}</TableCell>
                      <TableCell>{String(value)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {evaluation.range}
                      </TableCell>
                      <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                    </TableRow>
                  );
                })}
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Created at
                </TableCell>
                <TableCell
                  colSpan={3}
                  className="text-sm text-muted-foreground"
                >
                  {new Date(String(panel.createdAt)).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-bg-start via-health-bg-mid to-health-bg-end py-12 mb-20">
      <div className="container mx-auto space-y-8">
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
            Your Health Panels
          </h1>
          <p className="text-muted-foreground">
            Showing results for {data.username} ({data.email})
          </p>
        </div>

        {renderPanel("Blood Panel", "🩸", data.userBloodPanel)}
        {renderPanel("Lipid Panel", "❤️", data.userLipidPanel)}
        {renderPanel("Metabolic Panel", "⚖️", data.metabolicPanel)}
      </div>
    </div>
  );
}
