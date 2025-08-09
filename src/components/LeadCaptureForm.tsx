import { useState } from "react";
import { Mail, User, CheckCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateLeadForm, ValidationError } from "@/lib/validation";
import { useLeadStore } from "@/lib/lead-store";

// Types
type FormField = {
  value: string;
  error?: string;
};

type LeadForm = {
  name: FormField;
  email: FormField;
  industry: FormField;
};

// Constants
const INITIAL_FORM_STATE: LeadForm = {
  name: { value: "" },
  email: { value: "" },
  industry: { value: "" },
};

const INDUSTRY_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

// Utility functions
const createLeadPayload = (form: LeadForm) => ({
  name: form.name.value,
  email: form.email.value,
  industry: form.industry.value,
  submitted_at: new Date().toISOString(),
});

// Main Component
export const LeadCaptureForm = () => {
  const [form, setForm] = useState<LeadForm>(INITIAL_FORM_STATE);
  const [submissionState, setSubmissionState] = useState<
    "idle" | "submitting" | "success"
  >("idle");
  const { leads, addLead } = useLeadStore();

  const handleFieldChange = (field: keyof LeadForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: { value, error: undefined },
    }));
  };

  const validateForm = () => {
    const payload = createLeadPayload(form);
    const errors = validateLeadForm(payload);

    if (errors.length > 0) {
      const newForm = { ...form };
      errors.forEach((error) => {
        newForm[error.field as keyof LeadForm] = {
          ...newForm[error.field as keyof LeadForm],
          error: error.message,
        };
      });
      setForm(newForm);
      return false;
    }
    return true;
  };

  const submitForm = async () => {
    setSubmissionState("submitting");
    try {
      const payload = createLeadPayload(form);

      const response = await fetch(
        "https://ytyopyznqpnylebzibby.supabase.co/functions/v1/clever-task",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0eW9weXpucXBueWxlYnppYmJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTI3NTUsImV4cCI6MjA3MDEyODc1NX0.nr9WV_ybqZ6PpWT6GjAQm0Bsdr-Q5IejEhToV34VY4E",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      await addLead(payload);
      setSubmissionState("success");
      setForm(INITIAL_FORM_STATE);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionState("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await submitForm();
    }
  };

  const resetForm = () => {
    setSubmissionState("idle");
  };

  // Success View
  if (submissionState === "success") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gradient-card p-8 rounded-2xl shadow-card border border-border backdrop-blur-sm animate-slide-up text-center">
          <SuccessIndicator />
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Welcome aboard! 🎉
          </h2>
          <p className="text-muted-foreground mb-2">
            Thanks for joining! We'll be in touch soon with updates.
          </p>
          <p className="text-sm text-accent mb-8">
            You're #{leads.length} in this session
          </p>
          <NextSteps />
          <Button
            onClick={resetForm}
            variant="outline"
            className="w-full border-border hover:bg-accent/10 transition-smooth group"
          >
            Submit Another Lead
            <User className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <SocialPrompt />
        </div>
      </div>
    );
  }

  // Form View
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-card p-8 rounded-2xl shadow-card border border-border backdrop-blur-sm animate-slide-up">
        <FormHeader />
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            icon={User}
            field="name"
            value={form.name.value}
            error={form.name.error}
            onChange={(value) => handleFieldChange("name", value)}
            placeholder="Your name"
          />
          <FormInput
            icon={Mail}
            field="email"
            value={form.email.value}
            error={form.email.error}
            onChange={(value) => handleFieldChange("email", value)}
            placeholder="your@email.com"
            type="email"
          />
          <IndustrySelect
            value={form.industry.value}
            error={form.industry.error}
            onChange={(value) => handleFieldChange("industry", value)}
          />
          <SubmitButton loading={submissionState === "submitting"} />
        </form>
        <FormFooter />
      </div>
    </div>
  );
};

// Sub-components
const SuccessIndicator = () => (
  <div className="relative mb-6">
    <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow animate-glow">
      <CheckCircle className="w-10 h-10 text-primary-foreground" />
    </div>
  </div>
);

const NextSteps = () => (
  <div className="space-y-4">
    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
      <p className="text-sm text-foreground">
        💡 <strong>What's next?</strong>
        <br />
        We'll send you exclusive updates, early access, and behind-the-scenes
        content.
      </p>
    </div>
  </div>
);

const SocialPrompt = () => (
  <div className="mt-6 pt-6 border-t border-border">
    <p className="text-xs text-muted-foreground">
      Follow our journey on social media for real-time updates
    </p>
  </div>
);

const FormHeader = () => (
  <div className="text-center mb-8">
    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
      <Mail className="w-8 h-8 text-primary-foreground" />
    </div>
    <h2 className="text-2xl font-bold text-foreground mb-2">
      Join Our Community
    </h2>
    <p className="text-muted-foreground">Be the first to know when we launch</p>
  </div>
);

const FormInput = ({
  icon: Icon,
  value,
  error,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) => (
  <div className="space-y-2">
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground transition-smooth ${
          error ? "border-destructive" : "focus:border-accent focus:shadow-glow"
        }`}
      />
    </div>
    {error && (
      <p className="text-destructive text-sm animate-fade-in">{error}</p>
    )}
  </div>
);

const IndustrySelect = ({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <div className="relative">
      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`pl-10 h-12 bg-input border-border text-foreground transition-smooth ${
            error
              ? "border-destructive"
              : "focus:border-accent focus:shadow-glow"
          }`}
        >
          <SelectValue placeholder="Select your industry" />
        </SelectTrigger>
        <SelectContent>
          {INDUSTRY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    {error && (
      <p className="text-destructive text-sm animate-fade-in">{error}</p>
    )}
  </div>
);

const SubmitButton = ({ loading }: { loading: boolean }) => (
  <Button
    type="submit"
    disabled={loading}
    className="w-full h-12 bg-gradient-primary text-primary-foreground font-semibold rounded-lg shadow-glow hover:shadow-[0_0_60px_hsl(210_100%_60%/0.3)] transition-smooth transform hover:scale-[1.02]"
  >
    {loading ? (
      <span className="flex items-center">
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Processing...
      </span>
    ) : (
      <>
        <CheckCircle className="w-5 h-5 mr-2" />
        Get Early Access
      </>
    )}
  </Button>
);

const FormFooter = () => (
  <p className="text-xs text-muted-foreground text-center mt-6">
    By submitting, you agree to receive updates. Unsubscribe anytime.
  </p>
);
