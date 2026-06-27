import type { Variants } from 'motion/react';
import type { AnimationCollection } from '../model/animation.types';

export type PageTransitionAnimationName = 'slide' | 'lift' | 'depth';

export type PageTransitionDirection = 1 | -1;

interface PageTransitionAnimation {
    perspective: number;
    variants: Variants;
}

export const PAGE_TRANSITION_ANIMATION_NAMES = ['slide', 'lift', 'depth'] as const satisfies AnimationCollection<PageTransitionAnimationName>;

export const DEFAULT_PAGE_TRANSITION_ANIMATION: PageTransitionAnimationName = 'slide';

export const PAGE_TRANSITION_ANIMATIONS: Record<PageTransitionAnimationName, PageTransitionAnimation> = {
    slide: {
        perspective: 1400,

        variants: {
            initial: (direction: PageTransitionDirection) => ({
                opacity: 0,
                x: direction * 34,
                y: 8,
                scale: 0.992,
            }),

            animate: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,

                transition: {
                    type: 'spring',
                    stiffness: 290,
                    damping: 32,
                    mass: 0.82,
                },
            },

            exit: (direction: PageTransitionDirection) => ({
                opacity: 0,
                x: direction * -24,
                y: -5,
                scale: 0.995,

                transition: {
                    duration: 0.2,
                    ease: [0.4, 0, 1, 1],
                },
            }),
        },
    },

    lift: {
        perspective: 1500,

        variants: {
            initial: (direction: PageTransitionDirection) => ({
                opacity: 0,
                y: direction * 34,
                scale: 0.982,
                rotateX: direction * -3,
                transformOrigin: direction > 0 ? 'center bottom' : 'center top',
            }),

            animate: {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,

                transition: {
                    type: 'spring',
                    stiffness: 265,
                    damping: 30,
                    mass: 0.86,
                },
            },

            exit: (direction: PageTransitionDirection) => ({
                opacity: 0,
                y: direction * -24,
                scale: 0.989,
                rotateX: direction * 2,

                transition: {
                    duration: 0.21,
                    ease: [0.4, 0, 1, 1],
                },
            }),
        },
    },

    depth: {
        perspective: 1700,

        variants: {
            initial: (direction: PageTransitionDirection) => ({
                opacity: 0,
                scale: direction > 0 ? 0.965 : 1.02,
                z: -55,
            }),

            animate: {
                opacity: 1,
                scale: 1,
                z: 0,

                transition: {
                    type: 'spring',
                    stiffness: 245,
                    damping: 29,
                    mass: 0.9,
                },
            },

            exit: (direction: PageTransitionDirection) => ({
                opacity: 0,
                scale: direction > 0 ? 1.012 : 0.978,
                z: -34,

                transition: {
                    duration: 0.22,
                    ease: [0.4, 0, 1, 1],
                },
            }),
        },
    },
};

/** упрощенный переход для системного режима reduced motion */
export const REDUCED_PAGE_TRANSITION_VARIANTS: Variants = {
    initial: {
        opacity: 0,
    },

    animate: {
        opacity: 1,

        transition: {
            duration: 0.16,
            ease: 'easeOut',
        },
    },

    exit: {
        opacity: 0,

        transition: {
            duration: 0.12,
            ease: 'easeIn',
        },
    },
};
