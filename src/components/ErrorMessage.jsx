import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useTheme } from '../App';

function ErrorMessage({ message, onDismiss }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`mb-6 p-4 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className={`font-medium ${isDark ? 'text-red-400' : 'text-red-700'}`}>Error</h4>
          <p className={`text-sm mt-1 ${isDark ? 'text-red-300/80' : 'text-red-600'}`}>{message}</p>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className={`p-1 rounded hover:${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
            <X className="w-4 h-4 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
