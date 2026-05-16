import { LucideIcon, ZodiacAquarius, ZodiacAries, ZodiacCancer, 
    ZodiacCapricorn, ZodiacGemini, ZodiacLeo,
    ZodiacLibra, ZodiacOphiuchus, ZodiacPisces,
    ZodiacSagittarius, ZodiacScorpio, ZodiacVirgo, ZodiacTaurus

 } from 'lucide-react';

interface ZodiacIconProps {
    name: string;
    size?: number;
    color?: string;
    strokeWidth?: number;
}

const zodiacIconMap: Record<string, LucideIcon> = {
    'ZodiacAquarius': ZodiacAquarius,
    'ZodiacAries': ZodiacAries,
    'ZodiacCancer': ZodiacCancer,
    'ZodiacCapricorn': ZodiacCapricorn,
    'ZodiacGemini': ZodiacGemini,
    'ZodiacLeo': ZodiacLeo,
    'ZodiacLibra': ZodiacLibra,
    'ZodiacOphiuchus': ZodiacOphiuchus,
    'ZodiacPisces': ZodiacPisces,
    'ZodiacSagittarius': ZodiacSagittarius,
    'ZodiacScorpio': ZodiacScorpio,
    'ZodiacVirgo': ZodiacVirgo,
    'ZodiacTaurus': ZodiacTaurus
};

export function ZodiacIcon({ name, size = 48, color = '#000000', strokeWidth = 1.5 }: ZodiacIconProps) {
    const IconComponent = zodiacIconMap[name];
    
    if (!IconComponent) {
        return null;
    }
    
    return <IconComponent size={size} color={color} strokeWidth={strokeWidth} />;
}