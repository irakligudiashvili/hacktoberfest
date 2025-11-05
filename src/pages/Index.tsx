import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HealthStatusOrb from "@/components/HealthStatusOrb";
import Logo from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto py-5 flex justify-between items-center ">
          <Logo />
          <Button
            onClick={() => navigate("/auth")}
            size="sm"
            className="rounded-full px-6 bg-[var(--main-blue)] hover:bg-[var(--blue)]"
          >
            Join Now
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-32">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Think you're healthy?
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            It's time to know for sure.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="rounded-full px-8 bg-[var(--main-blue)] hover:bg-[var(--blue)]"
          >
            Join Now
          </Button>

          <div className="mt-20 flex justify-center">
            <HealthStatusOrb status="optimal" />
          </div>
        </div>
      </section>

      {/* Image + Info Section */}
      <section className="py-20">
        <div className="container mx-auto ">
          <div className="grid lg:grid-cols-2 gap-2 items-stretch">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] order-0">
              <img
                src="/Image.png"
                alt="Healthy lifestyle"
                className="w-full h-full object-cover"
              />
            </div>
            <Card className="p-10 text-primary-foreground rounded-2xl flex flex-col justify-center bg-[var(--main-blue)] order-1">
              <p className="text-lg leading-relaxed">
                Get the clarity of your health status from biomarker testing to
                get a detailed and precise picture of your health.
              </p>
              <p className="mt-4 text-sm opacity-90 leading-relaxed">
                Life is complicated, your health doesn't have to be. We take
                complex biomarker data and turn it into actionable insights you
                can actually use.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Test Your Whole Body */}
      <section className="py-24  ">
        <div className="mx-auto grid items-center gap-3 xl:grid-cols-2 container ">
          {/* Left side — text */}
          <div className="">
            <h2 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              Test your whole
              <br /> body.
            </h2>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              From heart health to hormone balance, our comprehensive test
              panels help you detect early signs of potential health issues.
            </p>
            <button className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3">
              Join Now
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 17L17 7M17 7H9M17 7V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Right side — floating collage */}
          <div className="relative mx-auto h-[360px] w-full max-w-[620px] md:h-[420px]">
            {/* Biomarkers (large outlined pill) */}
            <div className="absolute left-[18px] top-[90px] z-10 rounded-2xl border border-indigo-300/70 bg-white/80 px-16 py-4 text-[28px] font-semibold text-indigo-700 shadow-sm backdrop-blur md:text-[32px]">
              Biomarkers
            </div>

            {/* Genetics (small gradient) */}
            <div className="absolute left-[50px] top-[55px] z-20 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 px-2 py-1  text-white shadow-lg flex items-end h-[50px]">
              <span className="font-semibold">Genetics</span>
            </div>

            {/* Imaging (vertical tag) */}
            <div className="absolute left-[150px] top-[160px] z-30 h-[100px]  px-2 rounded-xl bg-gradient-to-b from-indigo-500 to-sky-500 text-white shadow-lg">
              <div className="flex h-full items-start py-2 justify-center pb-2 font-semibold">
                Imaging
              </div>
            </div>

            {/* Prevention (medium gradient card) */}
            <div className="absolute left-[300px] top-[104px] z-30 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 px-4 py-3 text-white shadow-lg h-[70px]">
              <span className=" font-medium">Prevention</span>
            </div>

            {/* Nutrition (thin outlined tag) */}
            <div className="absolute right-[190px] top-[32px] rounded-xl border border-indigo-300/70 bg-white/80 px-8 py-2  font-semibold text-indigo-700 shadow-sm backdrop-blur h-[120px]">
              Nutrition
            </div>

            {/* Lifestyle (large gradient card) */}
            <div className="absolute right-[0px] top-[54px] z-20 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-7 py-6 text-white shadow-xl md:px-8 md:py-7">
              <div className="text-3xl font-semibold md:text-4xl">
                Lifestyle
              </div>
            </div>

            {/* Longevity (outlined chip) */}
            <div className="absolute right-[95px] top-[160px] z-10 rounded-2xl border border-sky-300/70 bg-white/80 px-5 h-[60px] text-sky-600 shadow-sm backdrop-blur flex items-end py-2">
              <span className="text-xl font-semibold">Longevity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Health Status */}
      <section className="py-24 container">
        <div className="mx-auto container rounded-3xl bg-[#ECF1FF] py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* LEFT: Logo rings + orb */}
            <div className="relative mx-auto h-[360px] w-full md:h-[420px]">
              {/* Logo rings (three C-shaped arcs) */}
              <svg
                viewBox="0 0 520 520"
                className="absolute inset-0 h-full w-full"
                fill="none"
                stroke="hsl(239 100% 65% / 0.35)" /* matches your --main-blue tone, faded */
                strokeWidth="10"
                strokeLinecap="round"
              >
                {/* We draw full circles, then mask a gap on the right to form the "C" */}
                <defs>
                  <mask id="c-gap-mask">
                    {/* full white = visible; black = hidden gap */}
                    <rect width="100%" height="100%" fill="#fff" />
                    {/* Hide a right-side wedge to create the C opening */}
                    <rect
                      x="260"
                      y="0"
                      width="300"
                      height="520"
                      fill="#000"
                      rx="0"
                    />
                    {/* Add small diagonal cuts (optional) to echo the brand shape */}
                    <rect
                      x="360"
                      y="50"
                      width="120"
                      height="120"
                      transform="rotate(35 420 110)"
                      fill="#000"
                    />
                    <rect
                      x="360"
                      y="350"
                      width="120"
                      height="120"
                      transform="rotate(-35 420 410)"
                      fill="#000"
                    />
                  </mask>
                </defs>

                {/* Outer, middle, inner “C” rings */}
                <circle cx="260" cy="260" r="190" mask="url(#c-gap-mask)" />
                <circle cx="260" cy="260" r="150" mask="url(#c-gap-mask)" />
                <circle cx="260" cy="260" r="110" mask="url(#c-gap-mask)" />
              </svg>

              {/* Orb in the middle (your component) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="rounded-full bg-white/70 p-2 shadow-[0_10px_30px_-10px_rgba(79,80,255,0.45)] backdrop-blur">
                  <HealthStatusOrb status="optimal" />
                </div>
              </div>
            </div>

            {/* RIGHT: Copy */}
            <div className="text-left md:pl-8">
              <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                Health Status
              </h2>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                Your health status is generated by your biomarkers test results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Health Center */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Health Center
              </h2>
              <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                Explore test results, join a future study, learn about test
                biomarkers, and set up long-term health goals.
              </p>
              <button className="text-primary inline-flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all">
                See More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-6 rounded-xl bg-accent/30 border-0 aspect-square flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-2">🧬</div>
                <div className="text-xs font-medium">Biomarker Info</div>
              </Card>
              <Card className="p-6 rounded-xl bg-primary/20 border-0 aspect-square flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-2">🔬</div>
                <div className="text-xs font-medium">Test Results</div>
              </Card>
              <Card className="p-6 rounded-xl bg-secondary/30 border-0 aspect-square flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-2">📊</div>
                <div className="text-xs font-medium">Health Goals</div>
              </Card>
              <Card className="p-6 rounded-xl bg-muted/50 border-0 aspect-square flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-2">✨</div>
                <div className="text-xs font-medium">Insights</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Proof of Health */}
      <section className="py-32 px-6 bg-muted/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Proof of Health</h2>
          <p className="text-base text-muted-foreground mb-16 max-w-xl mx-auto leading-relaxed">
            Keep it in your wallet (iOS, or android), certified by NFT
            technology, and shareable as a credential.
          </p>
          <div className="flex justify-center">
            <div className="relative max-w-xs">
              <Card className="bg-[#1a1f3a] border-0 rounded-3xl p-8 aspect-[9/16] flex flex-col items-center justify-between shadow-2xl">
                <div className="text-2xl font-bold text-white tracking-wide">
                  CONSENSUS
                </div>
                <div className="scale-75">
                  <HealthStatusOrb status="optimal" />
                </div>
                <div className="space-y-3 text-center">
                  <div className="text-lg font-semibold text-white">
                    Proof of Health
                  </div>
                  <div className="text-2xl">🇺🇸</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="item-1" className="border rounded-xl px-6">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                What is biomarker testing?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                Biomarker testing involves analyzing biological markers in your
                blood, urine, or other bodily fluids to assess your health
                status. These tests can reveal important information about your
                metabolism, organ function, hormone levels, and potential health
                risks before symptoms appear.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-xl px-6">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                When should we retest it again?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                We recommend retesting every 3-6 months to track changes and
                trends in your health markers. However, the frequency may vary
                based on your specific health goals, current conditions, and
                your healthcare provider's recommendations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-xl px-6">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                I already have a doctor. Can I still use this?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                Absolutely! Our platform is designed to complement your existing
                healthcare. You can easily share your results and insights with
                your doctor, giving them a more complete picture of your health
                for more informed care decisions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-xl px-6">
              <AccordionTrigger className="text-left hover:no-underline py-5">
                What if my results show something concerning or primary care
                physician?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                If your results indicate any concerning patterns, we'll flag
                them clearly and recommend consulting with a healthcare
                professional. Our platform provides the data and insights, but
                important health decisions should always be made in consultation
                with qualified medical professionals.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#0f1419] text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Get Started</h2>
          <p className="text-base text-white/70 mb-10">
            Begin your journey to better health today.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="rounded-full px-8 bg-[var(--main-blue)] hover:bg-[var(--blue)] text-primary-foreground"
          >
            Join Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#0f1419] border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-white/50">
              © 2025 Consensus HealthLab. All rights reserved.
            </div>
            <div className="flex gap-6 text-xs text-white/50">
              <button className="hover:text-white/80 transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-white/80 transition-colors">
                Terms of Service
              </button>
              <button className="hover:text-white/80 transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
