'use client'
import { getZodiacInfo } from '@/lib/utils/zodiac';
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
 import { ZodiacIcon } from '@/components/shared/ZodiacIcon';

interface ZodiacCardComponentProps {
    date: Date;
    showDates?: boolean;
    showElement?: boolean;
    size?: 'small' | 'medium' | 'large';
    emojiColor?: string;
    emojiGradient?: string[];
    t: (key: string) => string;
}

// Define types for element colors
type ElementType = 'Fire' | 'Water' | 'Earth' | 'Air';
type ElementColorMap = Record<ElementType, string>;

export function ZodiacCardComponent({
    date,
    showDates = true,
    showElement = true,
    size = 'medium',
    emojiColor,
    emojiGradient,
    t
}: ZodiacCardComponentProps) {
    const [zodiacInfo, setZodiacInfo] = useState<any>(null);

    useEffect(() => {
        const info = getZodiacInfo(date);
        setZodiacInfo(info);
    }, [date]);

    if (!zodiacInfo) {
        return <div>{t('common.loading')}</div>;
    }

    const emojiSizes = {
        small: 32,
        medium: 74,
        large: 96
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
            className="zodiac-card rounded-[20px] md:rounded-[40px] border border-border-light"
            style={{
                padding: '20px',
                textAlign: 'center',
                fontFamily: 'Arial, sans-serif',
                background: background,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
        >
            <div className="w-full flex items-center mb-4 mt-4 justify-center">
                <ZodiacIcon name={zodiacInfo.icon} size={emojiSizes[size]} color={elementEmojiColors[elementType]} />
            </div>
            <h2 style={{
                margin: '10px 0 5px',
                fontSize: size === 'small' ? '18px' : size === 'medium' ? '24px' : '32px'
            }}
                className="uppercase tracking-ultra font-bold">
                {t(zodiacInfo.nameKey)}
            </h2>

            {(showDates || showElement) && (
                <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '10px',
                }}
                    className="rounded-[10px] md:rounded-[20px] mb-2 mt-2">
                    {showElement && (
                        <p style={{ margin: '5px 0' }}>
                            {t('zodiac.elementLabel')}: {elementEmojis[elementType]} {elementValue}
                        </p>
                    )}
                    {showDates && (
                        <>
                            <div className="flex flex-nowrap gap-2 items-center justify-center text-sm">
                                <Calendar className="w-4 h-4" />
                                <p style={{ margin: '5px 0' }} className="whitespace-normal">
                                    {t('zodiac.periodLabel')}: {t(zodiacInfo.datesKey)}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}