import React from 'react';
import { CheckCircle2, Clock, Wrench, FileCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export const ComplaintTimeline = ({ timeline = [], currentStatus = 'PENDING' }) => {
  const getStepIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return Clock;
      case 'ASSIGNED':
        return FileCheck;
      case 'IN_PROGRESS':
        return Wrench;
      case 'RESOLVED':
      case 'CLOSED':
        return CheckCircle2;
      case 'REJECTED':
        return ShieldAlert;
      default:
        return Clock;
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-700 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {timeline.map((item, index) => {
          const Icon = getStepIcon(item.status);
          const isLast = index === timeline.length - 1;

          return (
            <li key={index} className="relative pb-8">
              {!isLast && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-start space-x-3">
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full border ${getStepColor(
                    item.status
                  )}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <p className="text-sm font-semibold text-slate-800">
                      {item.status.replace(/_/g, ' ')}
                    </p>
                    <time className="text-xs text-slate-400">
                      {item.changedAt
                        ? new Date(item.changedAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : 'Recently'}
                    </time>
                  </div>
                  <p className="text-xs font-medium text-teal-700 mt-0.5">
                    Updated by: {item.changedBy || 'System'}
                  </p>
                  {item.remarks && (
                    <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {item.remarks}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ComplaintTimeline;
