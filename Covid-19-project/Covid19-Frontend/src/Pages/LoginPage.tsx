import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLottie } from 'lottie-react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import loginAnimation from '../assets/lottie/login.json';
import registerAnimation from '../assets/lottie/register.json';

type FormMode = 'login' | 'register';

// ─── Backend-based field types ───────────────────────────────
interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

// ─── Input component ─────────────────────────────────────────
function InputField({
  id, label, type = 'text', icon: Icon, value, onChange, placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs tracking-widest uppercase text-slate-400">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon size={16} className="absolute left-4 text-slate-500 pointer-events-none" />
        <input
          id={id}
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-11 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 text-slate-500 hover:text-white transition-colors"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Password strength bar ────────────────────────────────────
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-white/10'}`}
          />
        ))}
      </div>
      <p className={`text-xs ${colors[strength].replace('bg-', 'text-')}`}>
        {labels[strength]}
      </p>
    </div>
  );
}

// ─── Main LoginPage ───────────────────────────────────────────
export default function LoginPage() {
  const [mode, setMode] = useState<FormMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Login state
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });

  // Register state — matches backend exactly: name, email, password
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '', email: '', password: '',
  });

  const { View: LottieView } = useLottie({
    animationData: mode === 'login' ? loginAnimation : registerAnimation,
    loop: true,
    autoplay: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500); // placeholder
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950">

      {/* ══════════════════════════════════════
          LEFT — Lottie Animation + Branding
      ══════════════════════════════════════ */}
      <div className="hidden md:flex w-1/2 min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
        </div>

        {/* Lottie Animation */}
        <div className="w-full h-full object-cover relative z-10 drop-shadow-2xl">
          {LottieView}
        </div>

        {/* Tagline */}
        <div className=" text-center px-12 relative z-10">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-white mb-3 block">
            &lt;Covid-19/&gt;
          </Link>
          <p className="text-xs text-slate-500 tracking-widest uppercase">
            Predict · Analyze · Protect
          </p>
        </div>

        {/* Bottom decoration dots */}
        <div className="absolute bottom-10 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT — Auth Form
      ══════════════════════════════════════ */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center px-6 md:px-14 py-20">

        {/* Form Card */}
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            {/* Mobile logo */}
            <Link to="/" className="md:hidden text-xl font-bold tracking-tighter text-white mb-6 block">
              &lt;Covid-19/&gt;
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-slate-500 text-sm mt-1.5">
              {mode === 'login'
                ? 'Sign in to access your dashboard'
                : 'Register to start predicting'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/5">
            {(['login', 'register'] as FormMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize ${mode === m ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'
                  }`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === 'login' ? (
              // ─── LOGIN FIELDS (backend: email, password) ───
              <>
                <InputField
                  id="login-email"
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={loginForm.email}
                  onChange={(v) => setLoginForm({ ...loginForm, email: v })}
                  placeholder="you@example.com"
                />
                <InputField
                  id="login-password"
                  label="Password"
                  type="password"
                  icon={Lock}
                  value={loginForm.password}
                  onChange={(v) => setLoginForm({ ...loginForm, password: v })}
                  placeholder="Enter your password"
                />
              </>
            ) : (
              // ─── REGISTER FIELDS (backend: name, email, password + confirmPassword) ───
              <>
                <InputField
                  id="reg-name"
                  label="Full Name"
                  type="text"
                  icon={User}
                  value={registerForm.name}
                  onChange={(v) => setRegisterForm({ ...registerForm, name: v })}
                  placeholder="John Doe"
                />
                <InputField
                  id="reg-email"
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  value={registerForm.email}
                  onChange={(v) => setRegisterForm({ ...registerForm, email: v })}
                  placeholder="you@example.com"
                />
                <InputField
                  id="reg-password"
                  label="Password"
                  type="password"
                  icon={Lock}
                  value={registerForm.password}
                  onChange={(v) => setRegisterForm({ ...registerForm, password: v })}
                  placeholder="Min 8 chars, uppercase, number, symbol"
                />
                {/* Password strength indicator */}
                <PasswordStrength password={registerForm.password} />
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-white text-slate-900 font-bold text-sm tracking-wider hover:bg-slate-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-slate-600 text-xs mt-8">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-white hover:text-slate-300 font-medium transition-colors"
            >
              {mode === 'login' ? 'Register here' : 'Sign in here'}
            </button>
          </p>
        </div>
      </div>

    </div>
  );
}
