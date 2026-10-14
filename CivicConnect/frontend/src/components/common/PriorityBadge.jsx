import React from 'react';
import { AlertCircle, ArrowUpCircle, MinusCircle, AlertTriangle } from 'lucide-react';

export const PriorityBadge = ({ priority = 'MEDIUM', size = 'md' }) => {
  const normalized = (priority || 'MEDIUM').toUpperCase();

  const configs = {
    LOW: {
      label: 'Low',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: MinusCircle
    },
    MEDIUM: {
      label: 'Medium',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: ArrowUpCircle
    },
    HIGH: {
      label: 'High',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: AlertTriangle
    },
    URGENT: {
      label: 'Urgent',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-300',
      icon: AlertCircle
    }
  };

  const config = configs[normalized] || configs.MEDIUM;
  const Icon = config.icon;

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {config.label}
    </span>
  );
};

export default PriorityBadge;
