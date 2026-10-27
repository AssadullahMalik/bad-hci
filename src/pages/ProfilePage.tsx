import React, { useState } from 'react';
import { useApp, ThemeMode } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Building2, 
  Check, 
  ShieldCheck, 
  ArrowLeft,
  Sun,
  Moon,
  Monitor,
  Globe,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { validateEmailField, validateRequiredField } from '../utils/validation';

export const ProfilePage: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    addToast, 
    navigate,
    theme,
    setTheme,
    currency,
    setCurrency,
    areaUnit,
    setAreaUnit
  } = useApp();

  const [name, setName] = useState(currentUser?.name || 'Alex Rivera');
  const [email, setEmail] = useState(currentUser?.email || 'alex.rivera@example.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-5678');
  const [bio, setBio] = useState(
    currentUser?.bio || 'Software architect searching for contemporary residential homes with dedicated office space.'
  );
  const [agency, setAgency] = useState(currentUser?.agency || 'Independent Buyer');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Real-time validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ name: false, email: false });

  const handleNameChange = (val: string) => {
    setName(val);
    if (touched.name) {
      setNameError(validateRequiredField(val, 'Full Name'));
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.email) {
      setEmailError(validateEmailField(val));
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true });

    const nErr = validateRequiredField(name, 'Full Name');
    const eErr = validateEmailField(email);
    setNameError(nErr);
    setEmailError(eErr);

    if (nErr || eErr) {
      // Bad demo: blocks the save (correctly) but never says which field or why.
      addToast('Invalid input.', 'error');
      return;
    }

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        agency: agency.trim()
      });
    }

    addToast('Profile changes and usability preferences saved successfully.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        <button
          onClick={() => navigate(currentUser?.role === 'seller' ? '/seller' : '/dashboard')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
            Account Management & System Settings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Profile & Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure display themes, localized unit conventions, personal details, and notification rules.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSaveProfile} noValidate className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-8">
          
          {/* User Avatar & Role */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-teal-500/40"
            />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{name}</h2>
              <div className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                Role: <span className="font-semibold text-teal-700 dark:text-teal-400">{currentUser?.role || 'Buyer'}</span>
                <span className="mx-2 text-slate-300 dark:text-slate-700">·</span>
                <span>Active Prototype Session</span>
              </div>
            </div>
          </div>

          {/* Bad demo: section headings replaced with vague zone labels; groups
              are no longer signalled consistently */}
          <div className="space-y-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-windover text-xs uppercase tracking-wider text-fuchsia-700 dark:text-fuchsia-300 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Look choices & regional stuff (section 2? or 1?)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Theme Selection */}
              <div>
                <label className="block font-courier text-[10px] lowcon-2 mb-2">
                  Chromatic arrangement (pick one; difference may be subtle)
                </label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-white text-teal-800 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Sun className="w-4 h-4 mb-1 text-amber-500" />
                    <span className="text-[11px]">Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-slate-900 text-teal-300 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Moon className="w-4 h-4 mb-1 text-teal-400" />
                    <span className="text-[11px]">Dark</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      theme === 'system'
                        ? 'bg-white dark:bg-slate-900 text-teal-800 dark:text-teal-300 shadow-xs font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Monitor className="w-4 h-4 mb-1 text-slate-500" />
                    <span className="text-[11px]">System</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Persisted across visits without visual flash on reload.
                </p>
              </div>

              {/* Currency & Unit Conventions */}
              <div>
                <label className="block font-courier text-[10px] lowcon-2 mb-2">
                  Money letters & size units (two separate things in one label)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">Valuation Currency:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setCurrency('USD')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          currency === 'USD' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrency('PKR')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          currency === 'PKR' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        PKR (₨)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">Area Unit:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setAreaUnit('sqft')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          areaUnit === 'sqft' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        sq ft
                      </button>
                      <button
                        type="button"
                        onClick={() => setAreaUnit('marla')}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                          areaUnit === 'marla' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Marla (225 sqft)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: PERSONAL CONTACT INFO WITH VALIDATION */}
          <div className="space-y-4">
            <h3 className="font-times text-sm italic lowcon-3">
              the personal numbers & names portion
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  The name (legal? undefined) <span className="text-amber-500">?</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, name: true }));
                      setNameError(validateRequiredField(name, 'Full Name'));
                    }}
                    aria-invalid={nameError ? 'true' : 'false'}
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-medium text-slate-900 dark:text-white transition-colors ${
                      nameError 
                        ? 'border-red-500 ring-1 ring-red-500/20' 
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                </div>
                {nameError && (
                  <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{nameError ? 'Invalid input.' : ''}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Electronic mail (must contain… you know the symbol) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => {
                      setTouched((prev) => ({ ...prev, email: true }));
                      setEmailError(validateEmailField(email));
                    }}
                    aria-invalid={emailError ? 'true' : 'false'}
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-medium text-slate-900 dark:text-white transition-colors ${
                      emailError 
                        ? 'border-red-500 ring-1 ring-red-500/20' 
                        : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'
                    }`}
                  />
                </div>
                {emailError && (
                  <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailError ? 'Operation unsuccessful.' : ''}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-windover text-xs uppercase text-fuchsia-700 dark:text-fuchsia-300 mb-1">
                  Dialable digits (enter manually in the format you feel)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-none font-medium text-slate-900 dark:text-white font-courier"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Agency or Brokerage Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Profile Bio & Search Criteria
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white leading-relaxed focus:ring-teal-500"
              />
            </div>
          </div>

          {/* SECTION: NOTIFICATIONS */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Alert-ish things? (optional like all obligations)
            </h3>
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <span>Receive instant email alerts when a seller responds to an AI Connect inquiry</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
              />
              <span>Receive weekly AI Matchmaker property recommendations matching my search criteria</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(currentUser?.role === 'seller' ? '/seller' : '/dashboard')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Depart (changes?? possibly not kept)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-fuchsia-700 hover:bg-amber-600 text-yellow-200 text-xs font-windover uppercase rounded-none shadow-sm transition-colors cursor-pointer"
            >
              Commit alterations to the record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
