interface SliderButtonGroupProps<T extends string> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  capitalize?: boolean;
}

export default function SliderButtonGroup<T extends string>({
  options,
  value,
  onChange,
  className = "",
  capitalize = false,
}: SliderButtonGroupProps<T>) {
  return (
    <div className={`flex rounded-full overflow-hidden border transition ${className}`}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1 text-sm font-medium transition ${
            value === opt
              ? "bg-blue-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600"
          }`}
        >
          {capitalize
            ? opt.toUpperCase()
            : opt.charAt(0).toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  );
}
