import { Loader2 } from 'lucide-react';

/**
 * Full-page loading spinner with FormulaOS branding.
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-navy-600 border-t-teal animate-spin" />
      </div>
      <p className="text-navy-400 text-sm animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
