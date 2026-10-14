import { useState } from 'react';
import { X, Mail, Lock, UserPlus, LogIn, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/translations';

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

type Mode = 'signin' | 'signup';

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { t } = useI18n();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<TranslationKey | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  if (!open) return null;

  const resetState = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorKey(null);
    setConfirmationSent(false);
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    setMode('signin');
    onClose();
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setErrorKey(null);
    setConfirmationSent(false);
  };

  const handleSubmit = async () => {
    setErrorKey(null);

    if (!email.trim() || !password) {
      setErrorKey('auth.errorFieldsRequired');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorKey('auth.errorPasswordMismatch');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorKey('auth.errorPasswordTooShort');
      return;
    }

    setLoading(true);

    const result = mode === 'signin'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password);

    setLoading(false);

    if (result.error) {
      setErrorKey(result.error as TranslationKey);
      return;
    }

    if (result.needsConfirmation) {
      setConfirmationSent(true);
      return;
    }

    // Success with session — close modal
    handleClose();
  };

  // Confirmation success state
  if (confirmationSent) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      >
        <div
          className="glass-card max-w-sm w-full p-6 animate-scale-in text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-full bg-emerald2-500/10 flex items-center justify-center mb-4 border border-emerald2-500/30 mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald2-400" />
          </div>
          <h3 className="text-lg font-display font-bold text-gold-100 mb-2">
            {t('auth.confirmationTitle')}
          </h3>
          <p className="text-sm text-midnight-300 leading-relaxed mb-6">
            {t('auth.confirmationDesc')}
          </p>
          <button onClick={handleClose} className="btn-primary w-full">
            {t('common.close')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="glass-card max-w-sm w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-display font-bold text-gold-100">
            {mode === 'signin' ? t('auth.signInTitle') : t('auth.signUpTitle')}
          </h3>
          <button onClick={handleClose} className="text-midnight-400 hover:text-midnight-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 mb-5 bg-midnight-900/60 rounded-xl p-1">
          <button
            onClick={() => switchMode('signin')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'signin'
                ? 'bg-gold-400 text-midnight-950'
                : 'text-midnight-300 hover:text-midnight-100'
            }`}
          >
            <LogIn className="w-4 h-4" />
            {t('auth.signIn')}
          </button>
          <button
            onClick={() => switchMode('signup')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'signup'
                ? 'bg-gold-400 text-midnight-950'
                : 'text-midnight-300 hover:text-midnight-100'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {t('auth.signUp')}
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-500 rtl:left-auto rtl:right-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email')}
              className="w-full bg-midnight-900/60 border border-midnight-700 rounded-xl pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 text-sm text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-gold-400/50 transition-colors"
              autoComplete="email"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-500 rtl:left-auto rtl:right-3.5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.password')}
              className="w-full bg-midnight-900/60 border border-midnight-700 rounded-xl pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 text-sm text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-gold-400/50 transition-colors"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Confirm password (signup only) */}
          {mode === 'signup' && (
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-500 rtl:left-auto rtl:right-3.5" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.confirmPassword')}
                className="w-full bg-midnight-900/60 border border-midnight-700 rounded-xl pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-3 text-sm text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-gold-400/50 transition-colors"
                autoComplete="new-password"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          )}

          {/* Error message */}
          {errorKey && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-900/30 rounded-lg px-3 py-2">
              {t(errorKey)}
            </p>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-midnight-900/30 border-t-midnight-900 rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
              </>
            )}
          </button>
        </div>

        {/* Switch mode link */}
        <p className="text-center text-xs text-midnight-400 mt-4">
          {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
          <button
            onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
          >
            {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
          </button>
        </p>
      </div>
    </div>
  );
}
