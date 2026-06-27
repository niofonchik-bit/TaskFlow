import { useState } from 'react';
import type { AnimationChoice, AnimationCollection } from './animation.types';
import { getRandomAnimationVariant } from './getRandomAnimationVariant';

/** выбирает заданную анимацию или случайный вариант один раз при монтировании */
export function useAnimationVariant<TName extends string>(
    variants: AnimationCollection<TName>,
    requestedVariant: AnimationChoice<TName> = variants[0],
): TName {
    const [randomVariant] = useState<TName>(() => getRandomAnimationVariant(variants));

    return requestedVariant === 'random' ? randomVariant : requestedVariant;
}
