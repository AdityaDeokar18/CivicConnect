import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Wrench, ShieldAlert, Archive } from 'lucide-react';

export const StatusBadge = ({ status = 'PENDING', size = 'md' }) => {
  const normalized = (status || 'PENDING').toUpperCase();

  const statusConfigs = {
    PENDING: {
      label: 'Pending',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: Clock,
      dot: 'bg-amber-500'
    },
    ASSIGNED: {
      label: 'Assigned',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: AlertCircle,
      dot: 'bg-blue-500'
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
      icon: Wrench,
      dot: 'bg-purple-500'
    },
    RESOLVED: {
      label: 'Resolved',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: CheckCircle2,
      dot: 'bg-emerald-500'
    },
    CLOSED: {
      label: 'Closed',
      bg: 'bg-teal-50',
      text: 'text-teal-900',
      border: 'border-teal-200',
      icon: Archive,
      dot: 'bg-teal-600'
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-200',
      icon: ShieldAlert,
      dot: 'bg-rose-500'
    }
  };

  const config = statusConfigs[normalized] || statusConfigs.PENDING;
  const Icon = config.icon;

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1 font-medium' : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
