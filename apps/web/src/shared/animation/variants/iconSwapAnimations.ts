import type { Transition, Variants } from 'motion/react';
import type { AnimationCollection } from '../model/animation.types';

export type IconSwapAnimationName = 'rotate' | 'flip' | 'pop' | 'slide' | 'blur';

interface IconSwapAnimation {
    perspective?: number;
    variants: Variants;
    transition: Transition;
}

export const ICON_SWAP_ANIMATION_NAMES = ['rotate', 'flip', 'pop', 'slide', 'blur'] as const satisfies AnimationCollection<IconSwapAnimationName>;

export const ICON_SWAP_ANIMATIONS: Record<IconSwapAnimationName, IconSwapAnimation> = {
    rotate: {
        variants: {
            initial: {
                opacity: 0,
                rotate: -120,
                scale: 0.65,
            },

            animate: {
                opacity: 1,
                rotate: 0,
                scale: 1,
            },

            exit: {
                opacity: 0,
                rotate: 120,
                scale: 0.65,
            },
        },

        transition: {
            type: 'spring',
            stiffness: 520,
            damping: 28,
        },
    },

    flip: {
        perspective: 500,

        variants: {
            initial: {
                opacity: 0,
                rotateY: -90,
                scale: 0.8,
            },

            animate: {
                opacity: 1,
                rotateY: 0,
                scale: 1,
            },

            exit: {
                opacity: 0,
                rotateY: 90,
                scale: 0.8,
            },
        },

        transition: {
            type: 'spring',
            stiffness: 420,
            damping: 30,
        },
    },

    pop: {
        variants: {
            initial: {
                opacity: 0,
                scale: 0.2,
                rotate: -18,
            },

            animate: {
                opacity: [0, 1, 1],
                scale: [0.2, 1.22, 1],
                rotate: [-18, 5, 0],
            },

            exit: {
                opacity: 0,
                scale: 0.3,
                rotate: 14,
            },
        },

        transition: {
            duration: 0.42,
            ease: [0.2, 0.9, 0.25, 1.25],
        },
    },

    slide: {
        variants: {
            initial: {
                opacity: 0,
                x: -12,
                y: 7,
                scale: 0.85,
            },

            animate: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
            },

            exit: {
                opacity: 0,
                x: 12,
                y: -7,
                scale: 0.85,
            },
        },

        transition: {
            type: 'spring',
            stiffness: 480,
            damping: 34,
        },
    },

    blur: {
        variants: {
            initial: {
                opacity: 0,
                scale: 1.35,
                filter: 'blur(8px)',
            },

            animate: {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
            },

            exit: {
                opacity: 0,
                scale: 0.7,
                filter: 'blur(8px)',
            },
        },

        transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};
