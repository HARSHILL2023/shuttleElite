
import { cn } from '../utils/cn';

const Select = ({ label, options, error, className, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-semibold text-text-muted ml-1 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={cn(
          'input-field appearance-none cursor-pointer',
          error && 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500',
          className
        )}
        {...props}
      >
        <option value="" disabled>Select Location</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-card text-text-main">
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-400 mt-1.5 ml-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Select;
