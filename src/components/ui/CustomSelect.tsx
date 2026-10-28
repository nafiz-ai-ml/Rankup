"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  description?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  className = "",
  menuClassName = "",
  disabled = false,
  size = "md",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: "py-2 px-3 text-xs",
    md: "py-2.5 px-3.5 text-xs sm:text-sm",
    lg: "py-3 px-4 text-sm",
  };

  return (
    <div ref={containerRef} className="relative w-full text-left">
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 rounded-xl border font-medium transition-all duration-200 cursor-pointer select-none ${
          sizeClasses[size]
        } ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-[#111827] shadow-lg shadow-blue-500/10"
            : "border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/60 hover:border-blue-500/40 hover:bg-slate-100/80 dark:hover:bg-slate-900/90"
        } ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        {/* Left: Selected Label & Icon */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedOption?.icon && (
            <span className="shrink-0 text-blue-500 dark:text-blue-400">
              {selectedOption.icon}
            </span>
          )}
          <span className="truncate text-slate-800 dark:text-slate-100 font-semibold">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {selectedOption.badge}
            </span>
          )}
        </div>

        {/* Right: Chevron with proper padding & breathing room */}
        <div className="shrink-0 ml-1.5 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors">
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ease-out ${
              isOpen ? "rotate-180 text-blue-500" : ""
            }`}
          />
        </div>
      </button>

      {/* Premium Floating Dropdown Popover */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 mt-2 z-50 rounded-2xl bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xl overflow-hidden py-1.5 animate-in fade-in-0 zoom-in-95 duration-200 ${menuClassName}`}
          style={{ minWidth: "100%" }}
        >
          {/* Scrollable list */}
          <div className="max-h-64 overflow-y-auto px-1.5 py-1 space-y-0.5 custom-scrollbar">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-blue-600/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {option.icon && (
                      <span className="shrink-0 text-slate-400 dark:text-slate-500">
                        {option.icon}
                      </span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {option.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {option.badge}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
