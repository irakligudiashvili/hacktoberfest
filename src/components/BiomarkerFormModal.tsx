import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBiomarkerStore, BiomarkerData } from "@/store/biomarkerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

interface BiomarkerFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<BiomarkerData>;
}

const biomarkerSchema = z.object({
  // CBC
  wbc: z.string().optional(),
  rbc: z.string().optional(),
  hemoglobin: z.string().optional(),
  hematocrit: z.string().optional(),
  platelets: z.string().optional(),
  
  // CMP
  glucose: z.string().optional(),
  creatinine: z.string().optional(),
  egfr: z.string().optional(),
  sodium: z.string().optional(),
  potassium: z.string().optional(),
  calcium: z.string().optional(),
  alt: z.string().optional(),
  albumin: z.string().optional(),
  
  // Lipid Panel
  totalCholesterol: z.string().optional(),
  ldl: z.string().optional(),
  hdl: z.string().optional(),
  triglycerides: z.string().optional(),
});

const BiomarkerFormModal = ({ open, onOpenChange, initialData }: BiomarkerFormModalProps) => {
  const { setBiomarkerData } = useBiomarkerStore();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form with extracted data
  useEffect(() => {
    if (initialData) {
      const stringData = Object.entries(initialData).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {} as Record<string, string>);
      setFormData(stringData);
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      biomarkerSchema.parse(formData);
      
      // Convert string values to numbers and filter out empty values
      const numericData = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value && value !== '') {
          acc[key as keyof typeof formData] = parseFloat(value as string);
        }
        return acc;
      }, {} as any);

      // Check if at least one field is filled
      if (Object.keys(numericData).length === 0) {
        toast({
          title: "No Data Entered",
          description: "Please enter at least one biomarker value.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      setBiomarkerData(numericData);
      
      toast({
        title: "Success",
        description: "Lab results submitted successfully!",
      });
      
      setFormData({});
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: "Please check your inputs and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Enter Lab Results</DialogTitle>
          <DialogDescription>
            Fill in your biomarker values. All fields are optional.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Complete Blood Count (CBC) */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  🩸 Complete Blood Count (CBC)
                </h3>
                <p className="text-sm text-muted-foreground">White blood cells, red blood cells, and platelets</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wbc">WBC (×10⁹/L)</Label>
                  <Input
                    id="wbc"
                    type="number"
                    step="0.1"
                    placeholder="4.0-8.0"
                    value={formData.wbc || ""}
                    onChange={(e) => handleChange("wbc", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 4.0-8.0</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rbc">RBC (×10¹²/L)</Label>
                  <Input
                    id="rbc"
                    type="number"
                    step="0.1"
                    placeholder="4.2-5.5"
                    value={formData.rbc || ""}
                    onChange={(e) => handleChange("rbc", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 4.2-5.5</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
                  <Input
                    id="hemoglobin"
                    type="number"
                    step="0.1"
                    placeholder="13.5-16.5"
                    value={formData.hemoglobin || ""}
                    onChange={(e) => handleChange("hemoglobin", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 13.5-16.5 (M) / 12-15 (F)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hematocrit">Hematocrit (%)</Label>
                  <Input
                    id="hematocrit"
                    type="number"
                    step="0.1"
                    placeholder="40-50"
                    value={formData.hematocrit || ""}
                    onChange={(e) => handleChange("hematocrit", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 40-50 (M) / 36-45 (F)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platelets">Platelets (×10⁹/L)</Label>
                  <Input
                    id="platelets"
                    type="number"
                    step="1"
                    placeholder="150-350"
                    value={formData.platelets || ""}
                    onChange={(e) => handleChange("platelets", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 150-350</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Comprehensive Metabolic Panel (CMP) */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  ⚖️ Comprehensive Metabolic Panel (CMP)
                </h3>
                <p className="text-sm text-muted-foreground">Blood sugar, kidney function, and electrolytes</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="glucose">Glucose (fasting) (mg/dL)</Label>
                  <Input
                    id="glucose"
                    type="number"
                    step="0.1"
                    placeholder="75-90"
                    value={formData.glucose || ""}
                    onChange={(e) => handleChange("glucose", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 75-90</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
                  <Input
                    id="creatinine"
                    type="number"
                    step="0.1"
                    placeholder="0.7-1.1"
                    value={formData.creatinine || ""}
                    onChange={(e) => handleChange("creatinine", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 0.7-1.1 (M) / 0.6-1.0 (F)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="egfr">eGFR (mL/min)</Label>
                  <Input
                    id="egfr"
                    type="number"
                    step="1"
                    placeholder=">90"
                    value={formData.egfr || ""}
                    onChange={(e) => handleChange("egfr", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: &gt;90</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sodium">Sodium (mmol/L)</Label>
                  <Input
                    id="sodium"
                    type="number"
                    step="0.1"
                    placeholder="137-142"
                    value={formData.sodium || ""}
                    onChange={(e) => handleChange("sodium", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 137-142</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="potassium">Potassium (mmol/L)</Label>
                  <Input
                    id="potassium"
                    type="number"
                    step="0.1"
                    placeholder="4.0-4.8"
                    value={formData.potassium || ""}
                    onChange={(e) => handleChange("potassium", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 4.0-4.8</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calcium">Calcium (mg/dL)</Label>
                  <Input
                    id="calcium"
                    type="number"
                    step="0.1"
                    placeholder="9.2-10.0"
                    value={formData.calcium || ""}
                    onChange={(e) => handleChange("calcium", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 9.2-10.0</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alt">ALT (U/L)</Label>
                  <Input
                    id="alt"
                    type="number"
                    step="1"
                    placeholder="<25"
                    value={formData.alt || ""}
                    onChange={(e) => handleChange("alt", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: &lt;25</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="albumin">Albumin (g/dL)</Label>
                  <Input
                    id="albumin"
                    type="number"
                    step="0.1"
                    placeholder="4.2-5.0"
                    value={formData.albumin || ""}
                    onChange={(e) => handleChange("albumin", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 4.2-5.0</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Lipid Panel */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  ❤️ Lipid Panel
                </h3>
                <p className="text-sm text-muted-foreground">Cholesterol and cardiovascular health</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalCholesterol">Total Cholesterol (mg/dL)</Label>
                  <Input
                    id="totalCholesterol"
                    type="number"
                    step="1"
                    placeholder="150-180"
                    value={formData.totalCholesterol || ""}
                    onChange={(e) => handleChange("totalCholesterol", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: 150-180</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ldl">LDL (mg/dL)</Label>
                  <Input
                    id="ldl"
                    type="number"
                    step="1"
                    placeholder="<100"
                    value={formData.ldl || ""}
                    onChange={(e) => handleChange("ldl", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: &lt;100</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hdl">HDL (mg/dL)</Label>
                  <Input
                    id="hdl"
                    type="number"
                    step="1"
                    placeholder=">60"
                    value={formData.hdl || ""}
                    onChange={(e) => handleChange("hdl", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: &gt;60</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="triglycerides">Triglycerides (mg/dL)</Label>
                  <Input
                    id="triglycerides"
                    type="number"
                    step="1"
                    placeholder="<90"
                    value={formData.triglycerides || ""}
                    onChange={(e) => handleChange("triglycerides", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Optimal: &lt;90</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Results"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BiomarkerFormModal;
