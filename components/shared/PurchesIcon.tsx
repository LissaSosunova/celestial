import { LucideIcon, Handbag, Library, Calendar, User, GripHorizontal, GripHorizontalIcon

 } from 'lucide-react';

interface PerchesIconProps {
    name: string;
    color?: string;
    size?: number
}

const fieldsIconMap: Record<string, LucideIcon> = {
    'slag': User,
    'name': GripHorizontalIcon,
    'description': GripHorizontalIcon,
    'price': Handbag,
    'type': Library,
    'dateOfPurchase': Calendar,
    'birthDate': Calendar,
};

export function PurchesIcon({ name, color = '#000000', size = 12 }: PerchesIconProps) {
    const IconComponent = fieldsIconMap[name];
    
    if (!IconComponent) {
        return null;
    }
    
    return <IconComponent size={size} color={color} />;
}