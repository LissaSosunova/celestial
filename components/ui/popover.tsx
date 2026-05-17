'use client';

import { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
}

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export function Popover({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block w-full">{children}</div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild = false }: { children: ReactNode; asChild?: boolean }) {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverTrigger must be used within Popover');

  return (
    <div ref={context.triggerRef} onClick={() => context.setOpen(!context.open)} className="cursor-pointer">
      {children}
    </div>
  );
}

export function PopoverContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  const context = useContext(PopoverContext);
  if (!context) throw new Error('PopoverContent must be used within Popover');

  if (!context.open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => context.setOpen(false)}
      />
      <div
        className={`absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}
        style={{
          top: context.triggerRef.current?.getBoundingClientRect().bottom,
          left: context.triggerRef.current?.getBoundingClientRect().left,
        }}
      >
        {children}
      </div>
    </>
  );
}