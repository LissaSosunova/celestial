// zodiac.ts
export interface ZodiacInfo {
    nameKey: string;        // Translation key for zodiac name
    emoji: string;          // Zodiac emoji
    elementKey: string;     // Translation key for element
    datesKey: string;       // Translation key for date range
    iconHtml: string;       // HTML code for icon
    icon: string;            // lucide-react
}

interface ZodiacSignData {
    signKey: string;        // Translation key for zodiac name
    emoji: string;
    elementKey: string;     // Translation key for element
    iconUnicode: string;
    datesKey: string;       // Translation key for date range
    icon: string
}

export function getZodiacInfo(date: Date): ZodiacInfo {
    const month = date.getMonth() + 1; // 1-12
    const day = date.getDate();

    const zodiacData: Record<string, ZodiacSignData> = {
        'Aries': {
            signKey: 'zodiac.signs.aries',
            emoji: '♈',
            elementKey: 'zodiac.elements.fire',
            iconUnicode: '&#9800;',
            datesKey: 'zodiac.dates.aries',
            icon: 'ZodiacAries'
        },
        'Taurus': {
            signKey: 'zodiac.signs.taurus',
            emoji: '♉',
            elementKey: 'zodiac.elements.earth',
            iconUnicode: '&#9801;',
            datesKey: 'zodiac.dates.taurus',
            icon: 'ZodiacTaurus'
        },
        'Gemini': {
            signKey: 'zodiac.signs.gemini',
            emoji: '♊',
            elementKey: 'zodiac.elements.air',
            iconUnicode: '&#9802;',
            datesKey: 'zodiac.dates.gemini',
            icon: 'ZodiacGemini'
        },
        'Cancer': {
            signKey: 'zodiac.signs.cancer',
            emoji: '♋',
            elementKey: 'zodiac.elements.water',
            iconUnicode: '&#9803;',
            datesKey: 'zodiac.dates.cancer',
            icon: 'ZodiacCancer'
        },
        'Leo': {
            signKey: 'zodiac.signs.leo',
            emoji: '♌',
            elementKey: 'zodiac.elements.fire',
            iconUnicode: '&#9804;',
            datesKey: 'zodiac.dates.leo',
            icon: 'ZodiacLeo'
        },
        'Virgo': {
            signKey: 'zodiac.signs.virgo',
            emoji: '♍',
            elementKey: 'zodiac.elements.earth',
            iconUnicode: '&#9805;',
            datesKey: 'zodiac.dates.virgo',
            icon: 'ZodiacVirgo'
        },
        'Libra': {
            signKey: 'zodiac.signs.libra',
            emoji: '♎',
            elementKey: 'zodiac.elements.air',
            iconUnicode: '&#9806;',
            datesKey: 'zodiac.dates.libra',
            icon: 'ZodiacLibra'
        },
        'Scorpio': {
            signKey: 'zodiac.signs.scorpio',
            emoji: '♏',
            elementKey: 'zodiac.elements.water',
            iconUnicode: '&#9807;',
            datesKey: 'zodiac.dates.scorpio',
            icon: 'ZodiacScorpio'
        },
        'Sagittarius': {
            signKey: 'zodiac.signs.sagittarius',
            emoji: '♐',
            elementKey: 'zodiac.elements.fire',
            iconUnicode: '&#9808;',
            datesKey: 'zodiac.dates.sagittarius',
            icon: 'ZodiacSagittarius'
        },
        'Capricorn': {
            signKey: 'zodiac.signs.capricorn',
            emoji: '♑',
            elementKey: 'zodiac.elements.earth',
            iconUnicode: '&#9809;',
            datesKey: 'zodiac.dates.capricorn',
            icon: 'ZodiacCapricorn'
        },
        'Aquarius': {
            signKey: 'zodiac.signs.aquarius',
            emoji: '♒',
            elementKey: 'zodiac.elements.air',
            iconUnicode: '&#9810;',
            datesKey: 'zodiac.dates.aquarius',
            icon: 'ZodiacAquarius'
        },
        'Pisces': {
            signKey: 'zodiac.signs.pisces',
            emoji: '♓',
            elementKey: 'zodiac.elements.water',
            iconUnicode: '&#9811;',
            datesKey: 'zodiac.dates.pisces',
            icon: 'ZodiacPisces'
        }
    };

    let zodiacKey: string;

    if ((month === 1 && day <= 19) || (month === 12 && day >= 22)) {
        zodiacKey = 'Capricorn';
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
        zodiacKey = 'Aquarius';
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
        zodiacKey = 'Pisces';
    } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
        zodiacKey = 'Aries';
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
        zodiacKey = 'Taurus';
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
        zodiacKey = 'Gemini';
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
        zodiacKey = 'Cancer';
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
        zodiacKey = 'Leo';
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
        zodiacKey = 'Virgo';
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
        zodiacKey = 'Libra';
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
        zodiacKey = 'Scorpio';
    } else {
        zodiacKey = 'Sagittarius';
    }

    const data = zodiacData[zodiacKey];

    const iconHtml = `
    <div class="zodiac-icon" style="display: inline-flex; align-items: center; gap: 8px;">
      <span style="font-size: 32px;">${data.emoji}</span>
      <span style="font-size: 24px; font-weight: bold;">${data.iconUnicode}</span>
    </div>
  `;

    return {
        nameKey: data.signKey,
        emoji: data.emoji,
        elementKey: data.elementKey,
        datesKey: data.datesKey,
        iconHtml: iconHtml.trim(),
        icon: data.icon
    };
}

export function getZodiacBySignName(signName: string): ZodiacSignData | null {
    const sign = signName.charAt(0).toUpperCase() + signName.slice(1).toLowerCase();
    const zodiacData = {
        'Aries': {
            signKey: 'zodiac.signs.aries', emoji: '♈', elementKey: 'zodiac.elements.fire',
            iconUnicode: '&#9800;', datesKey: 'zodiac.dates.aries', icon: 'ZodiacAries'
        },
        'Taurus': {
            signKey: 'zodiac.signs.taurus', emoji: '♉', elementKey: 'zodiac.elements.earth',
            iconUnicode: '&#9801;', datesKey: 'zodiac.dates.taurus', icon: 'ZodiacTaurus'
        },
        'Gemini': {
            signKey: 'zodiac.signs.gemini', emoji: '♊', elementKey: 'zodiac.elements.air',
            iconUnicode: '&#9802;', datesKey: 'zodiac.dates.gemini', icon: 'ZodiacGemini'
        },
        'Cancer': {
            signKey: 'zodiac.signs.cancer', emoji: '♋', elementKey: 'zodiac.elements.water',
            iconUnicode: '&#9803;', datesKey: 'zodiac.dates.cancer', icon: 'ZodiacCancer'
        },
        'Leo': {
            signKey: 'zodiac.signs.leo', emoji: '♌', elementKey: 'zodiac.elements.fire',
            iconUnicode: '&#9804;', datesKey: 'zodiac.dates.leo', icon: 'ZodiacLeo'
        },
        'Virgo': {
            signKey: 'zodiac.signs.virgo', emoji: '♍', elementKey: 'zodiac.elements.earth',
            iconUnicode: '&#9805;', datesKey: 'zodiac.dates.virgo', icon: 'ZodiacVirgo'
        },
        'Libra': {
            signKey: 'zodiac.signs.libra', emoji: '♎', elementKey: 'zodiac.elements.air',
            iconUnicode: '&#9806;', datesKey: 'zodiac.dates.libra', icon: 'ZodiacLibra'
        },
        'Scorpio': {
            signKey: 'zodiac.signs.scorpio', emoji: '♏', elementKey: 'zodiac.elements.water',
            iconUnicode: '&#9807;', datesKey: 'zodiac.dates.scorpio', icon: 'ZodiacScorpio'
        },
        'Sagittarius': {
            signKey: 'zodiac.signs.sagittarius', emoji: '♐', elementKey: 'zodiac.elements.fire',
            iconUnicode: '&#9808;', datesKey: 'zodiac.dates.sagittarius', icon: 'ZodiacSagittarius'
        },
        'Capricorn': {
            signKey: 'zodiac.signs.capricorn', emoji: '♑', elementKey: 'zodiac.elements.earth',
            iconUnicode: '&#9809;', datesKey: 'zodiac.dates.capricorn', icon: 'ZodiacCapricorn'
        },
        'Aquarius': {
            signKey: 'zodiac.signs.aquarius', emoji: '♒', elementKey: 'zodiac.elements.air',
            iconUnicode: '&#9810;', datesKey: 'zodiac.dates.aquarius', icon: 'ZodiacAquarius'
        },
        'Pisces': {
            signKey: 'zodiac.signs.pisces', emoji: '♓', elementKey: 'zodiac.elements.water',
            iconUnicode: '&#9811;', datesKey: 'zodiac.dates.pisces', icon: 'ZodiacPisces'
        }
    };

    return zodiacData[sign as keyof typeof zodiacData] || null;
}