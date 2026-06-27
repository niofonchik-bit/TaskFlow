import type { AnimationCollection } from './animation.types';

/** возвращает случайный вариант из непустой коллекции */
export function getRandomAnimationVariant<TValue>(variants: AnimationCollection<TValue>): TValue {
    const index = Math.floor(Math.random() * variants.length);

    return variants[index] ?? variants[0];
}
