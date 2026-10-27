import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  validateEmailField, 
  validatePasswordField, 
  validateConfirmPasswordField, 
  validateRequiredField 
} from '../utils/validation';
import { 
  Building2, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Loader2,
  Check
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { switchUserRole, navigate, addToast, users } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ----------------------------------------------------
  // LOGIN FORM STATE & VALIDATION
  // ----------------------------------------------------
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [loginTouched, setLoginTouched] = useState({
    email: false,
    password: false,
  });

  const [loginErrors, setLoginErrors] = useState({
    email: null as string | null,
    password: null as string | null,
  });

  // Real-time login validation
  useEffect(() => {
    if (loginTouched.email) {
      setLoginErrors((prev) => ({ ...prev, email: validateEmailField(loginEmail) }));
    }
  }, [loginEmail, loginTouched.email]);

  useEffect(() => {
    if (loginTouched.password) {
      setLoginErrors((prev) => ({ ...prev, password: validatePasswordField(loginPassword, 8) }));
    }
  }, [loginPassword, loginTouched.password]);

  // ----------------------------------------------------
  // REGISTER FORM STATE & VALIDATION
  // ----------------------------------------------------
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regRole, setRegRole] = useState<UserRole>('buyer');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const [regTouched, setRegTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  const [regErrors, setRegErrors] = useState({
    name: null as string | null,
    email: null as string | null,
    password: null as string | null,
    confirmPassword: null as string | null,
    terms: null as string | null,
  });

  // Real-time register validation
  useEffect(() => {
    if (regTouched.name) {
      setRegErrors((prev) => ({ ...prev, name: validateRequiredField(regName, 'Full Name') }));
    }
  }, [regName, regTouched.name]);

  useEffect(() => {
    if (regTouched.email) {
      setRegErrors((prev) => ({ ...prev, email: validateEmailField(regEmail) }));
    }
  }, [regEmail, regTouched.email]);

  // Password & Confirm Password cross-validation
  useEffect(() => {
    if (regTouched.password) {
      setRegErrors((prev) => ({ ...prev, password: validatePasswordField(regPassword, 8) }));
    }
    // Update confirmation error state when password changes
    if (regTouched.confirmPassword) {
      setRegErrors((prev) => ({ 
        ...prev, 
        confirmPassword: validateConfirmPasswordField(regConfirmPassword, regPassword) 
      }));
    }
  }, [regPassword, regTouched.password, regConfirmPassword, regTouched.confirmPassword]);

  useEffect(() => {
    if (regTouched.confirmPassword) {
      setRegErrors((prev) => ({ 
        ...prev, 
        confirmPassword: validateConfirmPasswordField(regConfirmPassword, regPassword) 
      }));
    }
  }, [regConfirmPassword, regPassword, regTouched.confirmPassword]);

  useEffect(() => {
    if (regTouched.terms) {
      setRegErrors((prev) => ({
        ...prev,
        terms: agreedTerms ? null : 'You must accept the terms to continue.',
      }));
    }
  }, [agreedTerms, regTouched.terms]);

  // ----------------------------------------------------
  // FORGOT PASSWORD STATE & VALIDATION
  // ----------------------------------------------------
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotTouched, setForgotTouched] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);

  useEffect(() => {
    if (forgotTouched) {
      setForgotError(validateEmailField(forgotEmail));
    }
  }, [forgotEmail, forgotTouched]);

  // General error banner for server or authentication failure
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

  // Bad HCI demo (Accessibility Failure #8): errors carry NO icon and no useful
  // text - they are marked only by a tiny red-tinted dash rendered in a very low
  // contrast class, so they are communicated by color alone and barely readable.
  // Submission is still blocked when fields are invalid (logic + security intact).
  const errMark = (
    <span className="inline-block w-2 h-0.5 bg-red-500/70 align-middle" aria-hidden="true" />
  );
  const errText = '·';

  // ----------------------------------------------------
  // SUBMISSION HANDLERS
  // ----------------------------------------------------
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitError(null);

    // Mark all login fields as touched to expose errors if invalid
    setLoginTouched({ email: true, password: true });

    const emailErr = validateEmailField(loginEmail);
    const passErr = validatePasswordField(loginPassword, 8);

    setLoginErrors({ email: emailErr, password: passErr });

    if (emailErr || passErr) {
      // Bad HCI demo (Poor Error Recovery #5): the password the user VALIDLY
      // typed is silently cleared on any field error - retype it every attempt.
      setLoginPassword('');
      return; // Prevent submission
    }

    setIsSubmitting(true);

    // Simulate async network request
    setTimeout(() => {
      setIsSubmitting(false);
      const matched = users.find((u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
      if (matched) {
        switchUserRole(matched.role);
        navigate(matched.role === 'seller' || matched.role === 'agent' ? '/seller' : '/dashboard');
      } else {
        // Authenticate as a new registered buyer session
        switchUserRole('buyer');
        navigate('/dashboard');
      }
    }, 700);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitError(null);

    // Mark all fields touched
    setRegTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    const nameErr = validateRequiredField(regName, 'Full Name');
    const emailErr = validateEmailField(regEmail);
    const passErr = validatePasswordField(regPassword, 8);
    const confirmErr = validateConfirmPasswordField(regConfirmPassword, regPassword);
    const termsErr = agreedTerms ? null : 'You must accept the terms to continue.';

    setRegErrors({
      name: nameErr,
      email: emailErr,
      password: passErr,
      confirmPassword: confirmErr,
      terms: termsErr,
    });

    if (nameErr || emailErr || passErr || confirmErr || termsErr) {
      // Bad HCI demo (Poor Error Recovery #5): both password fields are wiped
      // even when only the name or terms checkbox was the problem.
      setRegPassword('');
      setRegConfirmPassword('');
      return; // Prevent submission until valid
    }

    setIsSubmitting(true);

    // Simulate account creation
    setTimeout(() => {
      setIsSubmitting(false);
      switchUserRole(regRole);
      addToast('Registration flow completed.', 'info');
      navigate(regRole === 'seller' || regRole === 'agent' ? '/seller' : '/dashboard');
    }, 850);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitError(null);
    setForgotTouched(true);

    const emailErr = validateEmailField(forgotEmail);
    setForgotError(emailErr);

    if (emailErr) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setRecoverySent(true);
      // Security preserved: never reveals whether the account exists.
      addToast('If the address is registered, recovery instructions were transmitted.', 'info');
    }, 600);
  };

  // Bad HCI demo (Poor Efficiency #10): the "shortcut" no longer logs the user
  // in - it prefills ONLY the email and hides which one it touched, so the
  // remaining fields must be re-entered manually (recall load).
  const handleQuickDemoLogin = (role: UserRole) => {
    setFormSubmitError(null);
    const user = users.find((u) => u.role === role);
    if (user) {
      setLoginEmail(user.email);
      setLoginTouched({ email: false, password: false });
      setLoginErrors({ email: null, password: null });
      addToast('Demo persona seed applied (one field, guess which)', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-900 dark:bg-slate-800 text-teal-400 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' && 'Sign in to Property Partner'}
            {mode === 'register' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login' && 'Access saved properties, matchmaker preferences, and seller chats'}
            {mode === 'register' && 'Join as a prospective buyer, private seller, or licensed broker'}
            {mode === 'forgot' && 'Enter your email to receive simulated password recovery instructions'}
          </p>
        </div>

        {/* Quick Demo Persona Shortcuts Banner (HCI Shneiderman Rule 2: Shortcuts) */}
        {mode === 'login' && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 block">
              1-Click Demo Login (HCI Evaluation Shortcut)
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium text-center transition-colors cursor-pointer"
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('seller')}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium text-center transition-colors cursor-pointer"
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-1.5 px-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white dark:text-slate-950 rounded-md font-medium text-center transition-colors cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
          {formSubmitError && (
            <div 
              role="alert" 
              className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-400 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{formSubmitError}</span>
            </div>
          )}

          {/* ==================================================== */}
          {/* MODE 1: LOGIN                                         */}
          {/* ==================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label 
                  htmlFor="login-email" 
                  className="block font-courier text-[10px] lowcon-2 mb-1"
                >
                  Electronic mail identifier (with the @ thing) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onBlur={() => setLoginTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="e.g. asad@gmail.com"
                    aria-invalid={loginErrors.email ? 'true' : 'false'}
                    aria-describedby={loginErrors.email ? 'login-email-error' : undefined}
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      loginErrors.email
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : loginTouched.email && !loginErrors.email && loginEmail
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  {loginTouched.email && !loginErrors.email && loginEmail && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute right-3 top-2.5 pointer-events-none" />
                  )}
                </div>
                {loginErrors.email && (
                  <p 
                    id="login-email-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    {errMark}
                    <span className="lowcon-1">{errText}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label 
                    htmlFor="login-password" 
                    className="block font-times text-xs italic lowcon-3"
                  >
                    Access phrase <span className="text-amber-500">(needed?)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setFormSubmitError(null);
                    }}
                    className="text-[11px] text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onBlur={() => setLoginTouched((prev) => ({ ...prev, password: true }))}
                    placeholder="At least 8 characters"
                    aria-invalid={loginErrors.password ? 'true' : 'false'}
                    aria-describedby={loginErrors.password ? 'login-password-error' : undefined}
                    className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      loginErrors.password
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : loginTouched.password && !loginErrors.password && loginPassword
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer opacity-50"
                    aria-hidden="true"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p 
                    id="login-password-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    {errMark}
                    <span className="lowcon-1">{errText}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:bg-slate-400 text-white dark:text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Doing things...</span>
                  </>
                ) : (
                  <>
                    <span>Transact authentication</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setFormSubmitError(null);
                  }}
                  className="font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* MODE 2: REGISTER                                     */}
          {/* ==================================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label 
                  htmlFor="reg-name" 
                  className="block font-windover text-xs uppercase text-fuchsia-800 dark:text-fuchsia-300 mb-1"
                >
                  The name you go by (complete; no nicknames) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="reg-name"
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    onBlur={() => setRegTouched((prev) => ({ ...prev, name: true }))}
                    placeholder="e.g. Asad Malik"
                    aria-invalid={regErrors.name ? 'true' : 'false'}
                    aria-describedby={regErrors.name ? 'reg-name-error' : undefined}
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      regErrors.name
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : regTouched.name && !regErrors.name && regName
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  {regTouched.name && !regErrors.name && regName && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute right-3 top-2.5 pointer-events-none" />
                  )}
                </div>
                {regErrors.name && (
                  <p 
                    id="reg-name-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    {errMark}
                    <span className="lowcon-1">{errText}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label 
                  htmlFor="reg-email" 
                  className="block font-courier text-[10px] lowcon-2 mb-1"
                >
                  Electronic mail identifier (same format as login; guessed) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    onBlur={() => setRegTouched((prev) => ({ ...prev, email: true }))}
                    placeholder="e.g. asad@gmail.com"
                    aria-invalid={regErrors.email ? 'true' : 'false'}
                    aria-describedby={regErrors.email ? 'reg-email-error' : undefined}
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      regErrors.email
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : regTouched.email && !regErrors.email && regEmail
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  {regTouched.email && !regErrors.email && regEmail && (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute right-3 top-2.5 pointer-events-none" />
                  )}
                </div>
                {regErrors.email && (
                  <p 
                    id="reg-email-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    {errMark}
                    <span className="lowcon-1">{errText}</span>
                  </p>
                )}
              </div>

              {/* Account Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Intended Account Role
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setRegRole('buyer')}
                    className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                      regRole === 'buyer' 
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Buyer / Investor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('seller')}
                    className={`py-1.5 rounded-md transition-colors cursor-pointer ${
                      regRole === 'seller' 
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Seller / Agent
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label 
                  htmlFor="reg-password" 
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Choose secret (requirements exist; they are not listed here) <span className="text-amber-500">**</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    onBlur={() => setRegTouched((prev) => ({ ...prev, password: true }))}
                    placeholder="Must be at least 8 characters"
                    aria-invalid={regErrors.password ? 'true' : 'false'}
                    aria-describedby={regErrors.password ? 'reg-password-error' : undefined}
                    className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      regErrors.password
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : regTouched.password && !regErrors.password && regPassword
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regErrors.password && (
                  <p 
                    id="reg-password-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    {errMark}
                    <span className="lowcon-1">{errText}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label 
                  htmlFor="reg-confirm-password" 
                  className="block font-times text-xs italic lowcon-3 mb-1"
                >
                  Confirm Password? (yes the other one again; which one is implied)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    id="reg-confirm-password"
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    onBlur={() => setRegTouched((prev) => ({ ...prev, confirmPassword: true }))}
                    placeholder="Re-enter password"
                    aria-invalid={regErrors.confirmPassword ? 'true' : 'false'}
                    aria-describedby={regErrors.confirmPassword ? 'reg-confirm-password-error' : undefined}
                    className={`w-full pl-9 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                      regErrors.confirmPassword
                        ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                        : regTouched.confirmPassword && !regErrors.confirmPassword && regConfirmPassword
                        ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                    aria-label={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {regErrors.confirmPassword && (
                  <p 
                    id="reg-confirm-password-error" 
                    role="alert" 
                    className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                  >
                    {errMark}
                    <span className="lowcon-1">{errText}</span>
                  </p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 rounded-sm border-slate-300 dark:border-slate-600 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="leading-snug">
                    I agree to the HCI Demonstration Terms and understand this is an educational prototype. <span className="text-red-500">*</span>
                  </span>
                </label>
                {regErrors.terms && (
                  <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{regErrors.terms}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setFormSubmitError(null);
                  }}
                  className="font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* ==================================================== */}
          {/* MODE 3: FORGOT PASSWORD                              */}
          {/* ==================================================== */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {recoverySent ? (
                <div className="text-center space-y-4 py-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recovery step acknowledged</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    If the address is on file, recovery instructions have been simulated. Check the inbox. Or don't. Either way, return to sign in when ready.
                  </p>
                  <button
                    onClick={() => {
                      setRecoverySent(false);
                      setMode('login');
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} noValidate className="space-y-4">
                  <div>
                    <label 
                      htmlFor="forgot-email" 
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    >
                      Account Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        onBlur={() => setForgotTouched(true)}
                        placeholder="e.g. asad@gmail.com"
                        aria-invalid={forgotError ? 'true' : 'false'}
                        aria-describedby={forgotError ? 'forgot-email-error' : undefined}
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 font-medium transition-colors text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                          forgotError
                            ? 'border-red-500 ring-1 ring-red-500/20 bg-red-50/20 dark:bg-red-950/30'
                            : forgotTouched && !forgotError && forgotEmail
                            ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/20'
                            : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                        }`}
                      />
                    </div>
                    {forgotError && (
                      <p 
                        id="forgot-email-error" 
                        role="alert" 
                        className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium"
                      >
                        {errMark}
                        <span className="text-red-600 dark:text-red-400">{errText}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 disabled:bg-slate-400 text-white dark:text-slate-950 text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>

                  <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setFormSubmitError(null);
                      }}
                      className="font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
