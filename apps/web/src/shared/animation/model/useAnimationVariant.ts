import { useState } from 'react';
import type { AnimationChoice, AnimationCollection } from './animation.types';

/** выбирает вариант анимации один раз при монтировании */
export function useAnimationVariant<TName extends string>(
    variants: AnimationCollection<TName>,
    requestedVariant: AnimationChoice<TName> = 'random',
): TName {
    const [randomVariant] = useState<TName>(() => {
        const index = Math.floor(Math.random() * variants.length);

        return variants[index] ?? variants[0];
    });

    return requestedVariant === 'random' ? randomVariant : requestedVariant;
}
