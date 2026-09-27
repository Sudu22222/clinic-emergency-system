import React, { useState } from 'react';
import { Activity, ArrowRight, Lock, Mail, Phone, ShieldCheck, Stethoscope, User } from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { BloodGroup, UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { login, signup } = useHealth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginRole, setLoginRole] = useState<UserRole>('patient');
  const [signupRole, setSignupRole] = useState<UserRole>('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [specialty, setSpecialty] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password, loginRole);
      } else if (signupRole === 'patient' && !bloodGroup) {
        setError('Select your blood group to continue.');
      } else {
        await signup({
          name,
          email,
          password,
          phone,
          bloodGroup: bloodGroup || undefined,
          role: signupRole,
          specialty: signupRole === 'doctor' ? specialty : undefined,
          registrationCode: signupRole === 'doctor' ? registrationCode : undefined,
        });
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to reach the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <section className="w-full max-w-md border border-slate-700 bg-slate-900 p-7 shadow-2xl">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center bg-teal-500 text-slate-950">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">HealthPulse</h1>
            <p className="text-sm text-slate-400">Healthcare and emergency services</p>
          </div>
        </div>

        <div className="mb-6 border-b border-slate-700 pb-5">
          <div className="mb-2 flex items-center gap-2 text-teal-300">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Secure account access</span>
          </div>
          <h2 className="text-2xl font-bold">{mode === 'login' ? 'Sign in' : signupRole === 'doctor' ? 'Create doctor account' : 'Create patient account'}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {mode === 'login' ? 'Use your registered email and password.' : signupRole === 'doctor' ? 'Doctor registration requires an invitation code from the system owner.' : 'Create a patient account to continue.'}
          </p>
        </div>

        {mode === 'login' && (
          <div className="mb-5 grid grid-cols-2 border border-slate-700" role="group" aria-label="Choose account type">
            <button type="button" aria-pressed={loginRole === 'patient'} onClick={() => { setLoginRole('patient'); setError(''); }} className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold ${loginRole === 'patient' ? 'bg-teal-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>
              <User className="h-4 w-4" /> Patient Login
            </button>
            <button type="button" aria-pressed={loginRole === 'doctor'} onClick={() => { setLoginRole('doctor'); setError(''); }} className={`flex items-center justify-center gap-2 border-l border-slate-700 px-3 py-2.5 text-sm font-semibold ${loginRole === 'doctor' ? 'bg-teal-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>
              <Stethoscope className="h-4 w-4" /> Doctor / Admin
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <label className="block text-sm font-medium">Full name
                <span className="relative mt-1 block">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="w-full border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-teal-400" />
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-medium">Phone
                  <span className="relative mt-1 block">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                    <input required type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-2 text-sm outline-none focus:border-teal-400" />
                  </span>
                </label>
                {signupRole === 'patient' && <label className="block text-sm font-medium">Blood group
                  <select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value as BloodGroup)} className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-teal-400">
                    <option value="">Select...</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((group) => <option key={group}>{group}</option>)}
                  </select>
                </label>}
              </div>
              {signupRole === 'doctor' && (
                <>
                  <label className="block text-sm font-medium">Medical specialty
                    <input required value={specialty} onChange={(event) => setSpecialty(event.target.value)} placeholder="e.g. Cardiology" className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
                  </label>
                  <label className="block text-sm font-medium">Doctor registration code
                    <input required type="password" autoComplete="off" value={registrationCode} onChange={(event) => setRegistrationCode(event.target.value)} className="mt-1 w-full border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-teal-400" />
                  </label>
                </>
              )}
            </>
          )}

          <label className="block text-sm font-medium">Email address
            <span className="relative mt-1 block">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-teal-400" />
            </span>
          </label>
          <label className="block text-sm font-medium">Password
            <span className="relative mt-1 block">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input required minLength={8} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-teal-400" />
            </span>
          </label>

          {error && <p role="alert" className="border border-rose-800 bg-rose-950/60 px-3 py-2 text-sm text-rose-200">{error}</p>}

          <button disabled={submitting} type="submit" className="flex w-full items-center justify-center gap-2 bg-teal-400 px-4 py-3 font-bold text-slate-950 transition-colors hover:bg-teal-300 disabled:cursor-wait disabled:opacity-60">
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : signupRole === 'doctor' ? 'Register doctor account' : 'Create account'}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <button type="button" onClick={() => {
          if (mode === 'login') {
            setSignupRole(loginRole);
            setMode('signup');
          } else {
            setLoginRole(signupRole);
            setMode('login');
          }
          setError('');
        }} className="mt-5 w-full text-center text-sm text-slate-300 hover:text-teal-300">
          {mode === 'login' ? (loginRole === 'doctor' ? 'New doctor? Create a doctor account' : 'New patient? Create a patient account') : `Already registered? Sign in as ${signupRole === 'doctor' ? 'Doctor / Admin' : 'Patient'}`}
        </button>
      </section>
    </main>
  );
};