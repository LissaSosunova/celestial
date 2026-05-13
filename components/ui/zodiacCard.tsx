'use client'
import { getZodiacInfo } from '@/lib/utils/zodiac';
import { useEffect, useState } from 'react';
import { Sun, Scale, Baby, Heart, Calendar, Sparkles } from 'lucide-react';

interface ZodiacCardComponentProps {
    date: Date;
    showDates?: boolean;
    showElement?: boolean;
    size?: 'small' | 'medium' | 'large';
    emojiColor?: string;
    emojiGradient?: string[];
    t: (key: string) => string; // Translation function
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
        small: '32px',
        medium: '64px',
        large: '96px'
    };

    const cardSizes = {
        small: '200px',
        medium: '300px',
        large: '400px'
    };

    const elementColors: ElementColorMap = {
        'Fire': 'rgb(249 211 216)',
        'Water': 'rgb(199 231 235)',
        'Earth': 'rgb(192 217 200)',
        'Air': 'rgb(193 228 255)'
    };

    const elementEmojiColors: ElementColorMap = {
        'Fire': '#FF6B6B',
        'Water': '#4D9DE0',
        'Earth': '#5EBC67',
        'Air': '#FFD166'
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

    const getEmojiStyle = () => {
        const baseStyle = {
            fontSize: emojiSizes[size],
            marginBottom: '10px',
            display: 'inline-block'
        };

        if (emojiGradient && emojiGradient.length >= 2) {
            return {
                ...baseStyle,
                background: `linear-gradient(135deg, ${emojiGradient[0]}, ${emojiGradient[1]})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            };
        }

        if (emojiColor) {
            return {
                ...baseStyle,
                color: emojiColor,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            };
        }

        // Use the typed color map
        return {
            ...baseStyle,
            color: elementEmojiColors[elementType] || '#FFFFFF'
        };
    };

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
            <div style={getEmojiStyle()}>
                {zodiacInfo.emoji}
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