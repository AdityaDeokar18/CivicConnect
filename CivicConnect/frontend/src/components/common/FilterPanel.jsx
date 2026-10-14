import React from 'react';
import { Filter, X } from 'lucide-react';
import Select from './Select';
import Button from './Button';

export const FilterPanel = ({
  statusFilter,
  onStatusChange,
  departmentFilter,
  onDepartmentChange,
  priorityFilter,
  onPriorityChange,
  departments = [],
  onReset
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
        <Filter className="w-4 h-4 text-teal-600" />
        <span>Filters:</span>
      </div>

      <div className="w-40">
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Statuses' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'ASSIGNED', label: 'Assigned' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'RESOLVED', label: 'Resolved' },
            { value: 'CLOSED', label: 'Closed' },
          ]}
        />
      </div>

      {departments.length > 0 && (
        <div className="w-48">
          <Select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Departments' },
              ...departments.map(d => ({ value: d.name, label: d.name }))
            ]}
          />
        </div>
      )}

      {onPriorityChange && (
        <div className="w-36">
          <Select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Priorities' },
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'URGENT', label: 'Urgent' },
            ]}
          />
        </div>
      )}

      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-500">
          <X className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
};

export default FilterPanel;
