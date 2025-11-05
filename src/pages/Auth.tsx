import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import Logo from "@/components/Logo";
import HealthStatusOrb from "@/components/HealthStatusOrb";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

const registerSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

const baseUrl = "https://health-api-e3d6.onrender.com";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validated = loginSchema.parse(loginData);

      // ⬇️ Replace with your real LOGIN endpoint
      const res = await fetch(baseUrl + "/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      console.log("login response:", data);
      if (data?.newToken) localStorage.setItem("token", data.newToken);

      toast({ title: "Login successful", description: "Welcome back!" });
      navigate("/dashboard");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description:
            error?.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    try {
      const validated = registerSchema.parse(registerData);

      // ⬇️ Replace with your real REGISTER endpoint
      const res = await fetch(baseUrl + "/api/Auth/Register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) throw new Error("Failed to register");
      console.log(res);
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
      navigate("/dashboard");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.log(error);
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration failed",
          description: error?.message || "Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen w-full  text-white relative flex flex-col items-center  px-6">
        {/* Subtle vignette / radial glow */}
        <div className=" w-full flex justify-center my-10 pb-20">
          <Logo />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_-10%,#3b5bfd33,transparent_60%)]" />

        <Tabs value={tab} className="w-full max-w-md">
          <Card className="border-0 bg-transparent shadow-none p-0">
            {/* Header / Branding */}

            <div className="flex flex-col items-center mb-8 gap-5">
              {/* Orb / avatar */}
              <div>
                <HealthStatusOrb status="optimal" size={150} />
              </div>

              <h1 className="text-3xl font-semibold tracking-tight">
                {tab === "login" ? "Login" : "Sign Up"}
              </h1>
            </div>

            {/* Forms */}
            <TabsContent value="login" className="m-0">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 rounded-full bg-white text-black placeholder:text-black/50"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="********"
                    className="h-12 rounded-full bg-white text-black placeholder:text-black/50"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full rounded-full text-base font-semibold
                           bg-[var(--main-blue)]
                           hover:bg-[var(--blue)]"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <p className="text-center text-sm ">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("register")}
                    className="text-indigo-400 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="register" className="m-0">
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    type="text"
                    placeholder="username"
                    className="h-12 rounded-full bg-white text-black placeholder:text-black/50"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 rounded-full bg-white text-black placeholder:text-black/50"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="********"
                    className="h-12 rounded-full bg-white text-black placeholder:text-black/50"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full rounded-full text-base font-semibold
                           bg-[var(--main-blue)]
                           hover:bg-[var(--blue)]"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>

                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className="text-indigo-400 hover:underline"
                  >
                    Login
                  </button>
                </p>
              </form>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </>
  );
}
