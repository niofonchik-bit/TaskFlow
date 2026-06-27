import type { Transition, Variants } from 'motion/react';
import type { AnimationCollection } from '../../../shared/animation/model/animation.types';

export type AuthCardSwitchAnimationName = 'deck' | 'flip' | 'carousel' | 'fold' | 'swing';

export interface AuthCardSwitchCustom {
    direction: 1 | -1;
}

interface AuthCardSwitchAnimation {
    perspective: number;
    variants: Variants;
    layoutTransition: Transition;
}

export const AUTH_CARD_SWITCH_ANIMATION_NAMES = [
    'deck',
    'flip',
    'carousel',
    'fold',
    'swing',
] as const satisfies AnimationCollection<AuthCardSwitchAnimationName>;

export const AUTH_CARD_SWITCH_ANIMATIONS: Record<AuthCardSwitchAnimationName, AuthCardSwitchAnimation> = {
    deck: {
        perspective: 1400,

        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * 118,
                y: 34,
                scale: 0.9,
                rotateZ: direction * 7,
                rotateY: direction * -12,
                transformOrigin: direction > 0 ? '100% 0%' : '0% 0%',
            }),

            animate: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotateZ: 0,
                rotateY: 0,

                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 28,
                    mass: 0.82,
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * -145,
                y: -34,
                scale: 0.86,
                rotateZ: direction * -11,
                rotateY: direction * 16,

                transition: {
                    duration: 0.34,
                    ease: [0.4, 0, 0.2, 1],
                },
            }),
        },

        layoutTransition: {
            type: 'spring',
            stiffness: 260,
            damping: 30,
        },
    },

    flip: {
        perspective: 1600,

        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                rotateY: direction * 88,
                rotateX: direction * -6,
                scale: 0.94,
                transformOrigin: direction > 0 ? 'left center' : 'right center',
            }),

            animate: {
                opacity: 1,
                rotateY: 0,
                rotateX: 0,
                scale: 1,

                transition: {
                    type: 'spring',
                    stiffness: 245,
                    damping: 27,
                    mass: 0.9,
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                rotateY: direction * -88,
                rotateX: direction * 6,
                scale: 0.94,
                transformOrigin: direction > 0 ? 'right center' : 'left center',

                transition: {
                    duration: 0.38,
                    ease: [0.4, 0, 0.2, 1],
                },
            }),
        },

        layoutTransition: {
            type: 'spring',
            stiffness: 240,
            damping: 29,
        },
    },

    carousel: {
        perspective: 1200,

        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * 210,
                y: 14,
                scale: 0.86,
                rotateZ: direction * 4,
            }),

            animate: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotateZ: 0,

                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 31,
                    mass: 0.78,
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * -210,
                y: -14,
                scale: 0.86,
                rotateZ: direction * -4,

                transition: {
                    duration: 0.32,
                    ease: [0.4, 0, 0.2, 1],
                },
            }),
        },

        layoutTransition: {
            type: 'spring',
            stiffness: 315,
            damping: 34,
        },
    },

    fold: {
        perspective: 1500,

        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                rotateX: direction * -58,
                y: direction * 38,
                scaleY: 0.8,
                clipPath: direction > 0 ? 'inset(0 0 100% 0 round 26px)' : 'inset(100% 0 0 0 round 26px)',
                transformOrigin: direction > 0 ? 'top center' : 'bottom center',
            }),

            animate: {
                opacity: 1,
                rotateX: 0,
                y: 0,
                scaleY: 1,
                clipPath: 'inset(0% 0% 0% 0% round 26px)',

                transition: {
                    duration: 0.52,
                    ease: [0.22, 1, 0.36, 1],
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                rotateX: direction * 48,
                y: direction * -30,
                scaleY: 0.82,
                clipPath: direction > 0 ? 'inset(100% 0 0 0 round 26px)' : 'inset(0 0 100% 0 round 26px)',

                transition: {
                    duration: 0.36,
                    ease: [0.4, 0, 0.2, 1],
                },
            }),
        },

        layoutTransition: {
            duration: 0.44,
            ease: [0.22, 1, 0.36, 1],
        },
    },

    swing: {
        perspective: 1500,

        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * 72,
                y: 28,
                scale: 0.91,
                rotateY: direction * -34,
                rotateZ: direction * 6,
                transformOrigin: direction > 0 ? 'top right' : 'top left',
            }),

            animate: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotateY: 0,
                rotateZ: 0,

                transition: {
                    type: 'spring',
                    stiffness: 275,
                    damping: 24,
                    mass: 0.88,
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * -82,
                y: -24,
                scale: 0.9,
                rotateY: direction * 32,
                rotateZ: direction * -6,
                transformOrigin: direction > 0 ? 'top left' : 'top right',

                transition: {
                    duration: 0.35,
                    ease: [0.4, 0, 0.2, 1],
                },
            }),
        },

        layoutTransition: {
            type: 'spring',
            stiffness: 265,
            damping: 28,
        },
    },
};
