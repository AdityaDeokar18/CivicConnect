import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`block w-full rounded-lg border text-sm transition-colors
            ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2
            ${error
              ? 'border-rose-300 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500'
              : 'border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500'
            }
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export default Input;
