import { LucideIcon, Handbag, Library, Calendar, User, GripHorizontal, GripHorizontalIcon

 } from 'lucide-react';

interface PerchesIconProps {
    name: string;
    color?: string;
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

export function PurchesIcon({ name, color = '#000000' }: PerchesIconProps) {
    const IconComponent = fieldsIconMap[name];
    
    if (!IconComponent) {
        return null;
    }
    
    return <IconComponent size={12} color={color} />;
}