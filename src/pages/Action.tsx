import HealthStatusOrb from "@/components/HealthStatusOrb";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useBiomarkerStore } from "@/store/biomarkerStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateOverallHealth } from "@/utils/calculateOverallHealth";

interface DayPlan {
  day: number;
  dietTip: string;
  mealSuggestion: string;
  supplement: string;
  exercise: string;
  lifestyleTip: string;
  targetBiomarkers: string[];
}

const Action = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const { biomarkerData } = useBiomarkerStore();
  const [actionPlan, setActionPlan] = useState<DayPlan[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const healthStatus = calculateOverallHealth(biomarkerData);

  useEffect(() => {
    if (biomarkerData) {
      generateActionPlan();
    }
  }, [biomarkerData]);

  const generateActionPlan = async () => {
    if (!biomarkerData) {
      toast.error(
        "No biomarker data available. Please upload your results first."
      );
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-action-plan",
        {
          body: { biomarkerData },
        }
      );

      if (error) throw error;

      if (data?.days) {
        setActionPlan(data.days);
        toast.success("Your personalized action plan is ready!");
      }
    } catch (error) {
      console.error("Error generating action plan:", error);
      toast.error("Failed to generate action plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDate = () => new Date();

  const days = [
    {
      abbr: "Su",
      number: getCurrentDate().getDate() - getCurrentDate().getDay() + 0,
    },
    {
      abbr: "Mo",
      number: getCurrentDate().getDate() - getCurrentDate().getDay() + 1,
    },
    {
      abbr: "Tu",
      number: getCurrentDate().getDate() - getCurrentDate().getDay() + 2,
    },
    {
      abbr: "We",
      number: getCurrentDate().getDate() - getCurrentDate().getDay() + 3,
    },
    {
      abbr: "Th",
      number: getCurrentDate().getDate() - getCurrentDate().getDay() + 4,
    },
    {
      abbr: "Fr",
      number: getCurrentDate().getDate() - getCurrentDate().getDay() + 5,
    },
    {
      abbr: "Sa",
      number: getCurrentDate().getDate() - getCurrentDate().getDay() + 6,
    },
  ];

  const currentDayPlan = actionPlan?.find((plan) => plan.day === selectedDay);

  const notesStyle = {
    backgroundColor: "#F8C953",
  };

  const supplementsStyles = {
    backgroundColor: "#9FA8FB",
  };

  const exerciseStyles = {
    backgroundColor: "#A8DBA8",
  };

  const headerContainer = {
    width: "fit-content",
    paddingBottom: "25px",
  };

  const headerStyle = {
    backgroundColor: "#eeebeb89",
    borderStyle: "solid",
    borderRadius: "25px",
    padding: "5px 15px",
  };

  return (
    <div className="min-h-screen bg-background mb-20">
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-center items-center mb-16">
          <h1 className="text-3xl text-center text-[26px] font-semibold">
            This Week Plan
          </h1>
        </div>

        {/* Daily Calendar Selector */}
        <div className="mb-8 flex justify-center gap-2 overflow-x-auto pb-2">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`flex flex-col items-center min-w-[60px] py-3 px-4 rounded-lg transition-all ${
                selectedDay === index
                  ? "bg-primary text-white scale-105"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <span className="text-xs font-medium mb-1">{day.abbr}</span>
              <span className="text-lg font-bold">{day.number}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Recommendation Cards */}
        {isLoading ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-lg">
              Generating your personalized action plan...
            </p>
          </div>
        ) : !biomarkerData ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-lg mb-4">No biomarker data available</p>
            <p className="text-sm text-muted-foreground">
              Please upload your lab results to get personalized recommendations
            </p>
          </div>
        ) : !currentDayPlan ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <p className="text-lg">Loading your action plan...</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diet Tips Card */}
            <Card
              className="p-8 text-center glass-card h-52 flex flex-col justify-center hover:scale-105 transition-transform cursor-pointer overflow-hidden"
              style={notesStyle}
            >
              <div style={headerContainer}>
                <h2 style={headerStyle}>Diet Tips</h2>
              </div>
              <p className="text-sm">{currentDayPlan.dietTip}</p>
            </Card>

            {/* Meal Plan Card */}
            <Card className="p-8 text-center glass-card h-52 flex flex-col justify-center hover:scale-105 transition-transform cursor-pointer">
              <div style={headerContainer}>
                <h2 style={headerStyle}>Diet Plan</h2>
              </div>
              <p className="text-sm">{currentDayPlan.mealSuggestion}</p>
            </Card>

            {/* Supplement Reminder Card */}
            <Card
              className="p-8 text-center glass-card h-52 flex flex-col justify-center hover:scale-105 transition-transform cursor-pointer"
              style={supplementsStyles}
            >
              <div style={headerContainer}>
                <h2 style={headerStyle}>Supplements</h2>
              </div>
              <p className="text-sm">{currentDayPlan.supplement}</p>
            </Card>

            {/* Exercise Card */}
            <Card
              className="p-8 text-center glass-card h-52 flex flex-col justify-center hover:scale-105 transition-transform cursor-pointer"
              style={exerciseStyles}
            >
              <div style={headerContainer}>
                <h2 style={headerStyle}>Exercise</h2>
              </div>
              <p className="text-sm">{currentDayPlan.exercise}</p>
            </Card>

            {/* Lifestyle Tip Card */}
            <Card className="p-8 text-center glass-card h-52 flex flex-col justify-center hover:scale-105 transition-transform cursor-pointer">
              <div className="flex justify-center mb-4">
                <HealthStatusOrb status={healthStatus} size={80} />
              </div>
              <p className="text-sm">{currentDayPlan.lifestyleTip}</p>
            </Card>

            {/* Target Biomarkers Info */}
            {currentDayPlan.targetBiomarkers &&
              currentDayPlan.targetBiomarkers.length > 0 && (
                <Card className="p-8 text-center glass-card h-52 flex flex-col justify-center hover:scale-105 transition-transform cursor-pointer md:col-span-2">
                  <h3 className="text-sm font-semibold mb-2">
                    Today's Focus Areas
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentDayPlan.targetBiomarkers.join(", ")}
                  </p>
                </Card>
              )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Action;
