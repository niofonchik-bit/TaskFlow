import type { Transition, Variants } from 'motion/react';
import type { AnimationCollection } from '../model/animation.types';

export type IconSwapAnimationName = 'morph' | 'flip';

interface IconSwapAnimation {
    perspective?: number;
    variants: Variants;
    transition: Transition;
}

export const ICON_SWAP_ANIMATION_NAMES = ['morph', 'flip'] as const satisfies AnimationCollection<IconSwapAnimationName>;

export const DEFAULT_ICON_SWAP_ANIMATION: IconSwapAnimationName = 'morph';

export const ICON_SWAP_ANIMATIONS: Record<IconSwapAnimationName, IconSwapAnimation> = {
    morph: {
        variants: {
            initial: {
                opacity: 0,
                scale: 0.72,
                rotate: -10,
            },

            animate: {
                opacity: 1,
                scale: 1,
                rotate: 0,
            },

            exit: {
                opacity: 0,
                scale: 0.72,
                rotate: 10,
            },
        },

        transition: {
            type: 'spring',
            stiffness: 520,
            damping: 32,
            mass: 0.68,
        },
    },

    flip: {
        perspective: 500,

        variants: {
            initial: {
                opacity: 0,
                rotateY: -82,
                scale: 0.82,
            },

            animate: {
                opacity: 1,
                rotateY: 0,
                scale: 1,
            },

            exit: {
                opacity: 0,
                rotateY: 82,
                scale: 0.82,
            },
        },

        transition: {
            type: 'spring',
            stiffness: 420,
            damping: 31,
            mass: 0.72,
        },
    },
};
