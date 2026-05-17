'use client';

type ChipsProps = {
    name: string;
    value: string;
    isSelected?: boolean;
    icon?: React.ReactNode;
    onClick?: (value: string) => void;
}

export default function ChipsBtn({ name, value, isSelected = false, icon, onClick }: ChipsProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(value);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 w-auto p-1 rounded-[10px] md:rounded-[20px] md:p-2 
            text-[10px] uppercase tracking-ultra font-extrabold transition-all
            ${isSelected 
              ? 'bg-gold text-white border-gold' 
              : 'border border-border bg-secondary text-gold hover:bg-gold hover:text-white'
            }`}
    >
      {icon && <span className="w-3 h-3">{icon}</span>}
      {name}
    </button>
  );
}