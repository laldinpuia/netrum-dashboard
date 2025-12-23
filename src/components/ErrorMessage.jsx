import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff, Clock } from 'lucide-react';
import { useTheme } from '../App';

function ErrorMessage({ message, onRetry }) {
  const { theme } = useTheme();
  
  // Determine error type
  let errorType = 'generic';
  let errorIcon = AlertTriangle;
  let errorTitle = 'Error Loading Data';
  let errorDescription = message;
  let suggestion = 'Please try again or check your input.';
  
  if (message.includes('rate') || message.includes('429') || message.includes('too many')) {
    errorType = 'rateLimit';
    errorIcon = Clock;
    errorTitle = 'Rate Limit Exceeded';
    errorDescription = 'Too many requests to the API.';
    suggestion = 'Please wait 30 seconds before refreshing again.';
  } else if (message.includes('network') || message.includes('fetch') || message.includes('Failed')) {
    errorType = 'network';
    errorIcon = WifiOff;
    errorTitle = 'Connection Error';
    errorDescription = 'Unable to connect to Netrum API.';
    suggestion = 'Check your internet connection and try again.';
  } else if (message.includes('not found') || message.includes('404') || message.includes('invalid')) {
    errorType = 'notFound';
    errorTitle = 'Node Not Found';
    errorDescription = 'The specified node or wallet address was not found.';
    suggestion = 'Please verify your Node ID or Wallet Address is correct.';
  }

  const Icon = errorIcon;

  return (
    <div className={`mb-6 p-6 ${theme === 'dark' ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'} border rounded-xl`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'}`}>
          <Icon className="w-6 h-6 text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-red-300' : 'text-red-700'} mb-1`}>{errorTitle}</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-red-400/80' : 'text-red-600'} mb-2`}>{errorDescription}</p>
          <p className={`text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>{suggestion}</p>
        </div>
        {onRetry && errorType !== 'rateLimit' && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
