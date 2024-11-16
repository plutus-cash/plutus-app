import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
  skip?: boolean;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
}

export function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.title} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                currentStep > index && "bg-green-500 border-green-500 text-white",
                currentStep === index && "border-primary",
                currentStep < index && "border-gray-300"
              )}
            >
              {currentStep > index ? <Check className="w-4 h-4" /> : <span className={cn("text-sm", currentStep === index && "text-primary")}>{index + 1}</span>}
            </div>
            {index < steps.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{step.title}</h3>
            <p className="text-sm text-gray-500">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
