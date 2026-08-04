// StoryElementSearch component - search bar for story elements
import { useCallback, useState, useEffect } from "react";

interface StoryElementSearchProps {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export const StoryElementSearch = ({
  value,
  onSearch,
  placeholder = "Buscar Story Elements...",
  debounceMs = 300,
  className = "",
}: StoryElementSearchProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Sync internal value with external value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Debounced search
  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      onSearch(newValue);
    }, debounceMs);

    setTimeoutId(newTimeoutId);
  }, [onSearch, debounceMs, timeoutId]);

  // Clear search
  const handleClear = useCallback(() => {
    setInternalValue("");
    onSearch("");
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [onSearch, timeoutId]);

  // Handle key down for immediate search on Enter
  const handleKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      onSearch(internalValue);
    }
  }, [onSearch, internalValue, timeoutId]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        \ud83d\udd0d
      </div>
      {internalValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          title="Limpiar b\u00fasqueda"
        >
          \u2715
        </button>
      )}
    </div>
  );
};

