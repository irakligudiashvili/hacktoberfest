import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  ArrowRight,
  Trash2,
  ShieldQuestion,
  StickyNote,
  LogOut,
  SquareArrowRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import HealthStatusOrb from "@/components/HealthStatusOrb";
import BiomarkerFormModal from "@/components/BiomarkerFormModal";
import { useBiomarkerStore } from "@/store/biomarkerStore";
import { calculateOverallHealth } from "@/utils/calculateOverallHealth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { biomarkerData, clearBiomarkerData } = useBiomarkerStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const healthStatus = calculateOverallHealth(biomarkerData);

  console.log(biomarkerData);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Accept only images and text files for best AI extraction results
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "text/plain"];

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description:
          "Please upload an image (JPG/PNG) or text file. For PDFs, take a screenshot first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: "Processing document",
      description: "AI is reading your lab report...",
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-biomarkers`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process document");
      }

      const result = await response.json();

      if (result.success && Object.keys(result.data).length > 0) {
        setExtractedData(result.data);
        toast({
          title: "Success!",
          description: `Extracted ${
            Object.keys(result.data).length
          } biomarker values from your document`,
        });
        setIsModalOpen(true);
      } else {
        toast({
          title: "No data found",
          description:
            "Could not extract biomarker data. Please enter manually.",
          variant: "destructive",
        });
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Processing failed",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or enter data manually",
        variant: "destructive",
      });
      setIsModalOpen(true);
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const handleClearData = () => {
    createLabData(biomarkerData);
    clearBiomarkerData();
    toast({
      title: "Data cleared",
      description: "All biomarker data has been removed",
    });
  };

  const getStatusText = () => {
    switch (healthStatus) {
      case "optimal":
        return "Your Health Status: Optimal";
      case "suboptimal":
        return "Your Health Status: On Range";
      case "critical":
        return "Your Health Status: At Risk";
      case "none":
        return "Health Status: Not verified";
      default:
        return "Your Health Status";
    }
  };

  const getBiomarkersCount = () => {
    if (healthStatus === "none") {
      return "Upload or enter your lab results";
    }
    const count = biomarkerData ? Object.keys(biomarkerData).length : 0;
    return `${count} biomarker${count !== 1 ? "s" : ""} tested`;
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h1 className="font-semibold text-[26px] text-center mt-5">
        Health Status
      </h1>
      <button
        onClick={handleLogout}
        className="gap-2 fixed right-3 top-5 bg-white rounded-full shadow-m p-2"
      >
        <LogOut className="w-4 h-4" />
      </button>
      {/* Main content */}
      <main className="container mx-auto px-4 pb-12 pt-7">
        <div className="max-w-2xl mx-auto space-y-10">
          {/* Status card */}
          <div className="text-center">
            <div className="rounded-2xl relative bg-[#e5e6e9] shadow-m w-full p-3 flex items-center justify-center gap-3 mx-auto mb-12">
              <div className=" bg-gray-600 rounded-full p-3">
                <ShieldQuestion className="text-gray-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{getStatusText()}</h2>
                <p className="text-sm text-muted-foreground">
                  {getBiomarkersCount()}
                </p>
              </div>
              <div className="absolute right-3 bottom-6">
                <Link to="/latest-results" className="cursor-pointer ">
                  <SquareArrowRight />
                </Link>
              </div>
            </div>
            <div className="flex justify-center mb-8">
              <HealthStatusOrb status={healthStatus} />
            </div>
          </div>

          {/* Upload section */}
          {!biomarkerData && (
            <div className="p-8 bg-[#e5e6e9] shadow-m rounded-2xl">
              <div className="w-full flex justify-center">
                <img src="/blood-icon.png" />
              </div>
              <h3 className="text-[14px] mb-4 flex items-center gap-2 text-center">
                Upload your lab test to get results in a clear, easy-to-read
                dashboard with each biomarker explained.
              </h3>

              <div className="space-y-4">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col justify-center"
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    className="gap-2 bg-[var(--main-blue)] hover:bg-[var(--blue)] cursor-pointer mx-auto"
                    disabled={isProcessing}
                    asChild
                  >
                    <span className="text-[16px]">
                      <Upload className="w-4 h-4" />
                      {isProcessing ? "Processing..." : "Upload Lab Results"}
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground text-center">
                  Tip: If you have a PDF, take a screenshot of it for best
                  results
                </p>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase items-center">
                    <div className="w-full h-[1px] bg-gray-400"></div>
                    <span className=" px-2 text-muted-foreground">Or</span>
                    <div className="w-full h-[1px] bg-gray-400"></div>
                  </div>
                </div>

                <p
                  className="underline text-[var(--main-blue)] text-center cursor-pointer w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  Enter Lab Data Manually
                </p>
              </div>
            </div>
          )}
          {biomarkerData && (
            <div className="p-8 border shadow-m rounded-2xl">
              <div className="flex flex-col gap-3 justify-center animate-fade-in w-full">
                <button className="gap-2 flex items-center justify-between py-4 rounded-2xl px-5 bg-[#e5e6e9] shadow-m">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full p-3 bg-blue-300">
                      <StickyNote />
                    </div>
                    <span>Basic Blood Test</span>
                  </div>
                  <Trash2
                    onClick={handleClearData}
                    className="w-5 h-5 text-red-500"
                  />
                </button>
                <button
                  onClick={() => navigate("/results")}
                  className="gap-2 py-4 bg-[var(--main-blue)] hover:bg-[var(--blue)] cursor-pointer flex items-center text-white justify-center rounded-2xl"
                >
                  Show Detailed Results
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Biomarker form modal */}
      <BiomarkerFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setExtractedData(null);
          }
        }}
        initialData={extractedData}
      />
    </div>
  );
};

export default Dashboard;

async function createLabData(labData: Record<string, any> | null) {
  if (!labData) throw new Error("No lab data to send.");

  const baseUrl = "https://health-api-e3d6.onrender.com";
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in again.");

  try {
    const res = await fetch(`${baseUrl}/api/Panels/CreateLabData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json, text/plain, */*",
      },
      body: JSON.stringify(labData),
    });

    // capture body safely (JSON or text or no content)
    const ct = res.headers.get("content-type") || "";
    let body: any = null;
    let raw = "";

    if (!res.ok) {
      if (ct.includes("application/json")) {
        body = await res.json().catch(() => null);
      } else {
        raw = await res.text().catch(() => "");
      }
      const message =
        body?.message ||
        body?.detail ||
        (typeof body === "string" ? body : "") ||
        raw ||
        `HTTP ${res.status}`;
      throw new Error(message);
    }

    // success: try JSON, else text, else null (204)
    if (ct.includes("application/json")) {
      return await res.json();
    } else if (res.status !== 204) {
      return await res.text();
    }
    return null;
  } catch (error) {
    console.error("❌ Error creating lab data:", error);
    throw error;
  }
}
