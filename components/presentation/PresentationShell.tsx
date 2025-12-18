"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PresentationShellProps {
  children: React.ReactNode[];
}

export function PresentationShell({ children }: PresentationShellProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = children.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div
           className="h-full bg-primary"
           initial={{ width: 0 }}
           animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
           transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full overflow-y-auto"
          >
            {children[currentStep]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <footer className="w-full border-t bg-card/80 backdrop-blur-md p-4 flex justify-between items-center z-50">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <span className="text-sm text-muted-foreground font-mono">
           {currentStep + 1} / {totalSteps}
        </span>

        <Button
          onClick={nextStep}
          disabled={currentStep === totalSteps - 1}
          className="gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </footer>
    </div>
  );
}
