export interface PasswordStrengthResult {
    score: number;
    label: string;
    color: string;
}

/** оценивает пароль только для визуальной подсказки */
export function getPasswordStrength(password: string): PasswordStrengthResult {
    if (!password) {
        return {
            score: 0,
            label: '',
            color: 'transparent',
        };
    }

    let score = 0;

    if (password.length >= 8) {
        score += 1;
    }

    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
        score += 1;
    }

    if (/\d/.test(password)) {
        score += 1;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score += 1;
    }

    if (password.length >= 12 && score < 4) {
        score += 1;
    }

    const normalizedScore = Math.max(1, Math.min(4, score));

    switch (normalizedScore) {
        case 1:
            return {
                score: normalizedScore,
                label: 'Слабый',
                color: '#E5604A',
            };

        case 2:
            return {
                score: normalizedScore,
                label: 'Средний',
                color: '#EFA13A',
            };

        case 3:
            return {
                score: normalizedScore,
                label: 'Хороший',
                color: '#5BA86A',
            };

        default:
            return {
                score: normalizedScore,
                label: 'Надёжный',
                color: '#3F9A5C',
            };
    }
}
