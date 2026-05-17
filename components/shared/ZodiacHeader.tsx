'use client'
import { getZodiacInfo } from '@/lib/utils/zodiac';
import { useEffect, useState } from 'react';
import { ZodiacIcon } from '@/components/shared/ZodiacIcon';

interface ZodiacHeaderComponentProps {
    date: Date;
    showDates?: boolean;
    showElement?: boolean;
    size?: 'small' | 'medium' | 'large';
    t: (key: string) => string; // Translation function
}

// Define types for element colors
type ElementType = 'Fire' | 'Water' | 'Earth' | 'Air';
type ElementColorMap = Record<ElementType, string>;

export function ZodiacHeader({
    date,
    showDates = true,
    showElement = true,
    size = 'medium',
    t
}: ZodiacHeaderComponentProps) {
    const [zodiacInfo, setZodiacInfo] = useState<any>(null);

    useEffect(() => {
        const info = getZodiacInfo(date);
        setZodiacInfo(info);
    }, [date]);

    if (!zodiacInfo) {
        return <div>{t('common.loading')}</div>;
    }

    const emojiSizes = {
        small: 18,
        medium: 32,
        large: 46
    };

    const elementColors: ElementColorMap = {
        'Fire': 'rgb(246, 235, 237)',
        'Water': 'rgb(235, 247, 249)',
        'Earth': 'rgb(233, 247, 237)',
        'Air': 'rgb(222, 238, 250)'
    };

    const elementEmojiColors: ElementColorMap = {
        'Fire': '#FF6B6B',
        'Water': '#4D9DE0',
        'Earth': '#5EBC67',
        'Air': '#02a3fb'
    };

    // Get element key and translate
    const elementKey = zodiacInfo.elementKey;
    const elementValue = t(elementKey);

    // Determine element type for color from the key
    const elementTypeFromKey = (key: string): ElementType => {
        if (key.includes('fire')) return 'Fire';
        if (key.includes('water')) return 'Water';
        if (key.includes('earth')) return 'Earth';
        if (key.includes('air')) return 'Air';
        return 'Fire'; // default
    };

    const elementType = elementTypeFromKey(elementKey);
    const background = elementColors[elementType] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

    const elementEmojis = {
        Fire: '🔥',
        Water: '💧',
        Earth: '🌍',
        Air: '💨',
    } as const;

    return (
        <div
            className="zodiac-card rounded-[20px] md:rounded-[40px] border border-border-light rounded-b-none md:rounded-b-none"
            style={{
                padding: '10px',
                background: background,
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
        >
            <div className="flex flex-row items-center gap-2 justify-center">
                <div className="mt-1">
                <ZodiacIcon name={zodiacInfo.icon} size={emojiSizes[size]} color={elementEmojiColors[elementType]} />
            </div>
            <h2 style={{
                margin: '5px 0 5px',
                fontSize: size === 'small' ? '12px' : size === 'medium' ? '18px' : '24px'
            }}
                className="uppercase tracking-ultra font-bold">
                {t(zodiacInfo.nameKey)}
            </h2>
            </div>

            {(showDates || showElement) && (
                <div className="rounded-[10px] md:rounded-[20px] mb-1 mt-1 text-sm">
                    {showElement && (
                        <p>
                            {t('zodiac.elementLabel')}: {elementEmojis[elementType]} {elementValue}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}