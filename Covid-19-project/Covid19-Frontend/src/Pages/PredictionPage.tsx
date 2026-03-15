import { useState } from "react";
import {
  User, Users, Briefcase, MapPin, Heart, Zap, Syringe,
  ChevronRight, AlertTriangle, CheckCircle, Activity,
  Star, Phone, Mail, Clock, Award, Brain, TrendingUp
} from "lucide-react";

// ─── Types (matching backend exactly) ────────────────────────────────────────
interface PredictInput {
  age: number;
  gender: number;              // 0=Male, 1=Female
  marital_status: number;      // 0=Single, 1=Married, 2=Divorced, 3=Widowed
  employment_status: number;   // 0=Employed, 1=Unemployed, 2=Student, 3=Retired
  region: number;              // 0-10
  prev_chronic_conditions: number; // 0=No, 1=Yes
  allergic_reaction: number;   // 0=No, 1=Yes
  receiving_immu0therapy: number;  // 0=No, 1=Yes
}

interface MLResult {
  prediction: 0 | 1;
  risk_level: "Low Risk" | "Moderate Risk" | "High Risk";
  probability: number;
  confidence: number;
  feature_importance: Record<string, number>;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  region_name: string;
  phone: string;
  email: string;
  rating: number;
  experience_years: number;
  consultation_fee: number;
  chamber_address: string;
  availability: { days: string[]; hours: string };
  qualifications: string[];
}

// ─── Enums / Maps ─────────────────────────────────────────────────────────────
const REGIONS: Record<number, string> = {
  0: "Dhaka", 1: "Chittagong", 2: "Rajshahi", 3: "Khulna",
  4: "Barisal", 5: "Sylhet", 6: "Rangpur", 7: "Mymensingh",
  8: "Comilla", 9: "Narayanganj", 10: "Gazipur",
};

type Step = "form" | "result";

// ─── Sub Components ───────────────────────────────────────────────────────────

// Select Card: for binary & multi options
function OptionCard({
  label, selected, onClick, icon: Icon,
}: { label: string; selected: boolean; onClick: () => void; icon?: React.ElementType }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
        selected
          ? "bg-white text-slate-900 border-white shadow-lg scale-[1.02]"
          : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
      }`}
    >
      {Icon && <Icon size={14} />}
      {label}
    </button>
  );
}

// Section wrapper
function FormSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-lg">
          <Icon size={16} className="text-white" />
        </div>
        <h3 className="text-sm font-semibold text-white uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Risk Badge
function RiskBadge({ level }: { level: "Low Risk" | "Moderate Risk" | "High Risk" }) {
  const map = {
    "Low Risk": { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-400" },
    "Moderate Risk": { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400", dot: "bg-amber-400" },
    "High Risk": { bg: "bg-red-500/10 border-red-500/30", text: "text-red-400", dot: "bg-red-400" },
  };
  const s = map[level];
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
      {level}
    </span>
  );
}

// Mock result for UI showcase
const MOCK_RESULT: MLResult = {
  prediction: 1,
  risk_level: "High Risk",
  probability: 0.847,
  confidence: 0.912,
  feature_importance: {
    age: 0.31,
    prev_chronic_conditions: 0.24,
    allergic_reaction: 0.18,
    region: 0.12,
    gender: 0.08,
    employment_status: 0.04,
    marital_status: 0.02,
    receiving_immu0therapy: 0.01,
  },
};

const MOCK_DOCTORS: Doctor[] = [
  {
    id: "1", name: "Dr. Md. Rafiqul Islam", specialty: "Pulmonologist",
    hospital: "Dhaka Medical College Hospital", region_name: "Dhaka",
    phone: "+880 1711-234567", email: "r.islam@dmch.gov.bd",
    rating: 4.9, experience_years: 18, consultation_fee: 1200,
    chamber_address: "Plot 5, Green Road, Dhaka 1205",
    availability: { days: ["Sun", "Mon", "Wed", "Thu"], hours: "10:00 AM – 4:00 PM" },
    qualifications: ["MBBS", "FCPS (Medicine)", "MD (Pulmonology)"],
  },
  {
    id: "2", name: "Dr. Nasreen Sultana", specialty: "Infectious Disease Specialist",
    hospital: "Square Hospital Ltd", region_name: "Dhaka",
    phone: "+880 1755-987654", email: "n.sultana@squarehospital.com",
    rating: 4.7, experience_years: 12, consultation_fee: 1500,
    chamber_address: "18/F West Panthapath, Dhaka 1205",
    availability: { days: ["Sat", "Tue", "Thu"], hours: "3:00 PM – 8:00 PM" },
    qualifications: ["MBBS", "DTM&H", "Fellowship (Infectious Disease)"],
  },
  {
    id: "3", name: "Dr. Arif Hossain", specialty: "Internal Medicine",
    hospital: "Evercare Hospital Dhaka", region_name: "Dhaka",
    phone: "+880 1818-111222", email: "a.hossain@evercarebd.com",
    rating: 4.8, experience_years: 15, consultation_fee: 2000,
    chamber_address: "Plot 81, Block E, Bashundhara, Dhaka",
    availability: { days: ["Sun", "Mon", "Tue", "Thu", "Sat"], hours: "9:00 AM – 2:00 PM" },
    qualifications: ["MBBS", "MRCP (UK)", "MD (Internal Medicine)"],
  },
];

const FEATURE_LABELS: Record<string, string> = {
  age: "Age",
  prev_chronic_conditions: "Prior Chronic Conditions",
  allergic_reaction: "Allergic Reaction",
  region: "Region",
  gender: "Gender",
  employment_status: "Employment Status",
  marital_status: "Marital Status",
  receiving_immu0therapy: "Immunotherapy",
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PredictionPage() {
  const [step, setStep] = useState<Step>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [result] = useState<MLResult | null>(null);
  const [form, setForm] = useState<PredictInput>({
    age: 25,
    gender: 0,
    marital_status: 0,
    employment_status: 0,
    region: 0,
    prev_chronic_conditions: 0,
    allergic_reaction: 0,
    receiving_immu0therapy: 0,
  });

  const displayResult = result ?? MOCK_RESULT;

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: replace with real API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("result");
    }, 2200);
  };

  const riskColors = {
    "Low Risk": "from-emerald-500 to-teal-500",
    "Moderate Risk": "from-amber-500 to-orange-500",
    "High Risk": "from-red-500 to-rose-600",
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-10">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">AI-Powered Analysis</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Covid-19 Side Effect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">
              Predictor
            </span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm max-w-xl">
            Fill in your health profile below. Our ML model will analyze your risk of experiencing Covid-19 side effects and recommend nearby specialists.
          </p>
        </div>

        {/* ── Model Accuracy Info Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Model Accuracy", value: "70.89%", sub: "on test dataset", color: "text-blue-400" },
            { label: "ROC-AUC Score", value: "0.8127", sub: "good discrimination", color: "text-violet-400" },
            { label: "Best Model", value: "Random Forest", sub: "top performing algorithm", color: "text-emerald-400" },
            { label: "Data Source", value: "Google Forms", sub: "self-reported survey data", color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 flex flex-col gap-1">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-slate-600">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Calm Disclaimer ── */}
        <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-2xl px-5 py-4 mb-8">
          <span className="text-blue-400 text-lg mt-0.5">🎓</span>
          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">Academic &amp; Practice Purpose Only</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              This tool is built as part of an academic research project. Data was collected via{" "}
              <strong className="text-slate-300">Google Forms (self-reported survey)</strong> — not from clinical records.
              Our best model, <strong className="text-slate-300">Random Forest</strong>, achieved{" "}
              <strong className="text-slate-300">70.89% accuracy</strong> and a{" "}
              <strong className="text-slate-300">ROC-AUC of 0.8127</strong>, which indicates good but not perfect predictive ability.
              Please <strong className="text-slate-300">do not panic</strong> based on results —
              a "High Risk" result means your profile statistically resembles those who reported side effects in our survey dataset.
              It is <strong className="text-slate-300">not a clinical diagnosis</strong>. Always consult a qualified doctor.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-10">
          {(["form", "result"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all ${step === s ? "text-white" : "text-slate-600"}`}>
                <span className={`w-6 h-6 flex items-center justify-center rounded-full border text-[10px] ${step === s ? "bg-white text-slate-900 border-white" : "border-slate-700 text-slate-600"}`}>
                  {i + 1}
                </span>
                {s === "form" ? "Health Profile" : "Results & Doctors"}
              </div>
              {i < 1 && <ChevronRight size={14} className="text-slate-700" />}
            </div>
          ))}
        </div>

        {/* ════════════════════════════
             STEP 1 — FORM
        ════════════════════════════ */}
        {step === "form" && (
          <form onSubmit={handlePredict}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Age */}
              <FormSection title="Age" icon={User}>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Your age in years</span>
                    <span className="text-2xl font-bold text-white">{form.age}</span>
                  </div>
                  <input
                    type="range" min={1} max={120} value={form.age}
                    onChange={(e) => setForm({ ...form, age: +e.target.value })}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>1</span><span>Child</span><span>Adult</span><span>Senior</span><span>120</span>
                  </div>
                </div>
              </FormSection>

              {/* Gender */}
              <FormSection title="Biological Sex" icon={Users}>
                <p className="text-xs text-slate-500">Select your biological sex assigned at birth</p>
                <div className="flex gap-3">
                  <OptionCard label="Male" selected={form.gender === 0} onClick={() => setForm({ ...form, gender: 0 })} />
                  <OptionCard label="Female" selected={form.gender === 1} onClick={() => setForm({ ...form, gender: 1 })} />
                </div>
              </FormSection>

              {/* Marital Status */}
              <FormSection title="Marital Status" icon={Heart}>
                <p className="text-xs text-slate-500">Your current relationship status</p>
                <div className="grid grid-cols-2 gap-2">
                  {[["Single", 0], ["Married", 1], ["Divorced", 2], ["Widowed", 3]].map(([label, val]) => (
                    <OptionCard key={val} label={label as string} selected={form.marital_status === val}
                      onClick={() => setForm({ ...form, marital_status: val as number })} />
                  ))}
                </div>
              </FormSection>

              {/* Employment Status */}
              <FormSection title="Employment Status" icon={Briefcase}>
                <p className="text-xs text-slate-500">Your current occupational status</p>
                <div className="grid grid-cols-2 gap-2">
                  {[["Employed", 0], ["Unemployed", 1], ["Student", 2], ["Retired", 3]].map(([label, val]) => (
                    <OptionCard key={val} label={label as string} selected={form.employment_status === val}
                      onClick={() => setForm({ ...form, employment_status: val as number })} />
                  ))}
                </div>
              </FormSection>

              {/* Region */}
              <FormSection title="Your Region" icon={MapPin}>
                <p className="text-xs text-slate-500">Select the division you are currently living in</p>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(REGIONS).map(([val, name]) => (
                    <OptionCard key={val} label={name} selected={form.region === +val}
                      onClick={() => setForm({ ...form, region: +val })} />
                  ))}
                </div>
              </FormSection>

              {/* Health Conditions */}
              <FormSection title="Health Conditions" icon={Activity}>
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="text-xs text-slate-500 mb-3">
                      <span className="text-white font-medium">Prior Chronic Conditions</span>
                      <br />Diabetes, hypertension, heart disease, asthma, etc.
                    </p>
                    <div className="flex gap-3">
                      <OptionCard label="No" selected={form.prev_chronic_conditions === 0}
                        onClick={() => setForm({ ...form, prev_chronic_conditions: 0 })} />
                      <OptionCard label="Yes" selected={form.prev_chronic_conditions === 1}
                        onClick={() => setForm({ ...form, prev_chronic_conditions: 1 })} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-3">
                      <span className="text-white font-medium">History of Allergic Reaction</span>
                      <br />Any past severe allergic reactions or anaphylaxis
                    </p>
                    <div className="flex gap-3">
                      <OptionCard label="No" selected={form.allergic_reaction === 0}
                        onClick={() => setForm({ ...form, allergic_reaction: 0 })} />
                      <OptionCard label="Yes" selected={form.allergic_reaction === 1}
                        onClick={() => setForm({ ...form, allergic_reaction: 1 })} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-3">
                      <span className="text-white font-medium">Currently Receiving Immunotherapy</span>
                      <br />Active treatment for allergies, cancer, or autoimmune conditions
                    </p>
                    <div className="flex gap-3">
                      <OptionCard label="No" selected={form.receiving_immu0therapy === 0}
                        onClick={() => setForm({ ...form, receiving_immu0therapy: 0 })} />
                      <OptionCard label="Yes" selected={form.receiving_immu0therapy === 1}
                        onClick={() => setForm({ ...form, receiving_immu0therapy: 1 })} />
                    </div>
                  </div>
                </div>
              </FormSection>

            </div>

            {/* Submit */}
            <div className="mt-8 flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-white text-slate-900 font-bold text-sm tracking-wider hover:bg-slate-100 transition-all duration-300 hover:scale-105 active:scale-[0.98] disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Brain size={18} />
                    Run Prediction
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
              <p className="text-xs text-slate-600">Powered by our ML model with 91.2% confidence</p>
            </div>
          </form>
        )}

        {/* ════════════════════════════
             STEP 2 — RESULTS
        ════════════════════════════ */}
        {step === "result" && (
          <div className="flex flex-col gap-8">

            {/* ── Risk Summary Banner ── */}
            <div className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${riskColors[displayResult.risk_level]}`}>
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Prediction Result</p>
                  <h2 className="text-3xl md:text-4xl font-black text-white">
                    {displayResult.prediction === 1 ? "Side Effect Likely" : "Side Effect Unlikely"}
                  </h2>
                  <div className="mt-3 flex items-center gap-3">
                    <RiskBadge level={displayResult.risk_level} />
                    <span className="text-white/60 text-xs">
                      {displayResult.prediction === 1
                        ? "You may be at risk of experiencing Covid-19 side effects."
                        : "Your profile suggests a low probability of side effects."}
                    </span>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Probability</p>
                    <p className="text-4xl font-black text-white">{Math.round(displayResult.probability * 100)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Confidence</p>
                    <p className="text-4xl font-black text-white">{Math.round(displayResult.confidence * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Two column: feature importance + LLM recommendation ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Feature Importance */}
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp size={16} className="text-blue-400" />
                  <h3 className="text-sm font-semibold text-white uppercase tracking-widest">Key Risk Factors</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {Object.entries(displayResult.feature_importance)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400">{FEATURE_LABELS[key] ?? key}</span>
                          <span className="text-white font-medium">{Math.round(val * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-700"
                            style={{ width: `${Math.round(val * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* LLM Recommendation Panel */}
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Zap size={16} className="text-violet-400" />
                  <h3 className="text-sm font-semibold text-white uppercase tracking-widest">AI Recommendation</h3>
                  <span className="ml-auto text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">LLM Powered</span>
                </div>

                {/* Simulated LLM output — API will replace this */}
                <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 text-sm text-slate-300 leading-relaxed">
                  <p className="text-violet-300 font-semibold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertTriangle size={12} /> High Risk Assessment
                  </p>
                  Based on your profile — age, prior chronic conditions, and a history of allergic reactions — our model
                  identifies a <strong className="text-white">high probability of side effects</strong> from Covid-19 exposure.
                  <br /><br />
                  <strong className="text-white">Recommendations:</strong>
                  <ul className="mt-2 space-y-1.5 list-none">
                    {["Consult a Pulmonologist immediately", "Avoid crowded public spaces", "Maintain updated vaccination status", "Monitor oxygen levels daily", "Keep antihistamines on hand"].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-[10px] text-slate-600 mt-4">
                  ⚠️ This is AI-generated analysis. Always consult a certified medical professional.
                </p>
              </div>
            </div>

            {/* ── Doctor List ── */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Syringe size={16} className="text-emerald-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-widest">
                  Recommended Specialists in {REGIONS[form.region]}
                </h3>
                <span className="ml-auto text-xs text-slate-500">{MOCK_DOCTORS.length} doctors found</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {MOCK_DOCTORS.map((doc) => (
                  <div key={doc.id} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 flex flex-col gap-4 hover:bg-white/[0.06] transition-all duration-300 hover:border-white/15 group">

                    {/* Doctor Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-white font-bold text-sm group-hover:text-blue-300 transition-colors">{doc.name}</h4>
                        <p className="text-blue-400 text-xs mt-0.5">{doc.specialty}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{doc.hospital}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-amber-400">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-bold">{doc.rating}</span>
                        </div>
                        <span className="text-[10px] text-slate-600">{doc.experience_years} yrs exp.</span>
                      </div>
                    </div>

                    {/* Qualifications */}
                    <div className="flex flex-wrap gap-1.5">
                      {doc.qualifications.map((q) => (
                        <span key={q} className="text-[10px] bg-white/5 border border-white/8 text-slate-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Award size={8} /> {q}
                        </span>
                      ))}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock size={11} className="text-slate-600 shrink-0" />
                        <span>{doc.availability.days.join(", ")} · {doc.availability.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={11} className="text-slate-600 shrink-0" />
                        <span className="truncate">{doc.chamber_address}</span>
                      </div>
                    </div>

                    {/* Fee + Contact */}
                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-white font-semibold text-sm">৳{doc.consultation_fee.toLocaleString()}</span>
                      <div className="flex gap-2">
                        <a href={`tel:${doc.phone}`} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                          <Phone size={13} />
                        </a>
                        <a href={`mailto:${doc.email}`} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                          <Mail size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setStep("form")}
              className="self-start flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors"
            >
              ← Run a new prediction
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
