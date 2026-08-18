import { useRouteError, useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  // Determine if it is a 404 or general route error
  const is404 = error?.status === 404;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center text-on-background">
      <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>

        {/* Brand Logo Header */}
        <div className="flex items-center justify-center gap-3 mb-8 relative z-10">
          <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center shadow-sm border border-outline-variant">
            <img src="/logo.png" alt="NiT Logo" className="object-contain w-full h-full" />
          </div>
          <span className="font-headline-md text-headline-md font-bold text-primary">NiT Admin</span>
        </div>

        {/* Error Illustration / Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-error-container/20 flex items-center justify-center text-error border border-error/10 animate-pulse">
            <span className="material-symbols-outlined text-4xl">
              {is404 ? 'construction' : 'error'}
            </span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="font-headline-md text-headline-md font-bold text-primary mb-2">
          {is404 ? 'Module Under Development' : 'System Error Encountered'}
        </h2>

        {/* Subtext */}
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          {is404
            ? 'The Departments module is currently scheduled for future backend integration. This page is currently under construction.'
            : error?.statusText || error?.message || 'An unexpected application error occurred.'}
        </p>

        {/* Details in development mode */}
        {error && !is404 && (
          <div className="bg-surface-container-high border border-outline-variant rounded-lg p-3 text-left font-mono text-xs overflow-auto max-h-32 mb-6">
            <span className="font-bold text-error">Error Info:</span> {error.message || JSON.stringify(error)}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto border border-outline hover:bg-surface-container-high text-primary font-label-md text-label-md py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
