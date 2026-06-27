import type { Transition, Variants } from 'motion/react';
import type { AnimationCollection } from '../../../shared/animation/model/animation.types';

export type AuthCardSwitchAnimationName = 'deck' | 'flip' | 'carousel' | 'fold' | 'portal';

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
    'portal',
] as const satisfies AnimationCollection<AuthCardSwitchAnimationName>;

export const AUTH_CARD_SWITCH_ANIMATIONS: Record<AuthCardSwitchAnimationName, AuthCardSwitchAnimation> = {
    deck: {
        perspective: 1400,

        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * 130,
                y: 42,
                scale: 0.88,
                rotateZ: direction * 8,
                rotateY: direction * -14,
                filter: 'blur(8px)',
                transformOrigin: direction > 0 ? '100% 0%' : '0% 0%',
            }),

            animate: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotateZ: 0,
                rotateY: 0,
                filter: 'blur(0px)',
                transition: {
                    type: 'spring',
                    stiffness: 310,
                    damping: 27,
                    mass: 0.85,
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * -165,
                y: -46,
                scale: 0.84,
                rotateZ: direction * -13,
                rotateY: direction * 18,
                filter: 'blur(10px)',
                transition: {
                    duration: 0.38,
                    ease: [0.4, 0, 0.2, 1],
                },
            }),
        },

        layoutTransition: {
            type: 'spring',
            stiffness: 260,
            damping: 28,
        },
    },

    flip: {
        perspective: 1600,

        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                rotateY: direction * 92,
                rotateX: direction * -8,
                scale: 0.92,
                filter: 'blur(6px)',
                transformOrigin: direction > 0 ? 'left center' : 'right center',
            }),

            animate: {
                opacity: 1,
                rotateY: 0,
                rotateX: 0,
                scale: 1,
                filter: 'blur(0px)',
                transition: {
                    type: 'spring',
                    stiffness: 250,
                    damping: 25,
                    mass: 0.95,
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                rotateY: direction * -92,
                rotateX: direction * 8,
                scale: 0.92,
                filter: 'blur(6px)',
                transformOrigin: direction > 0 ? 'right center' : 'left center',
                transition: {
                    duration: 0.42,
                    ease: [0.4, 0, 0.2, 1],
                },
            }),
        },

        layoutTransition: {
            type: 'spring',
            stiffness: 240,
            damping: 27,
        },
    },

    carousel: {
        perspective: 1200,

        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * 240,
                scale: 0.82,
                rotateZ: direction * 5,
                filter: 'blur(12px)',
            }),

            animate: {
                opacity: 1,
                x: 0,
                scale: 1,
                rotateZ: 0,
                filter: 'blur(0px)',
                transition: {
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * -240,
                scale: 0.82,
                rotateZ: direction * -5,
                filter: 'blur(12px)',
                transition: {
                    duration: 0.34,
                    ease: [0.4, 0, 0.2, 1],
                },
            }),
        },

        layoutTransition: {
            type: 'spring',
            stiffness: 320,
            damping: 32,
        },
    },

    fold: {
        perspective: 1500,

        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                rotateX: direction * -65,
                y: direction * 48,
                scaleY: 0.72,
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
                    duration: 0.58,
                    ease: [0.22, 1, 0.36, 1],
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                rotateX: direction * 55,
                y: direction * -35,
                scaleY: 0.75,
                clipPath: direction > 0 ? 'inset(100% 0 0 0 round 26px)' : 'inset(0 0 100% 0 round 26px)',
                transition: {
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                },
            }),
        },

        layoutTransition: {
            duration: 0.48,
            ease: [0.22, 1, 0.36, 1],
        },
    },

    portal: {
        perspective: 1200,

        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                scale: 0.52,
                rotateZ: direction * 12,
                rotateY: direction * 22,
                filter: 'blur(18px) saturate(1.4)',
                clipPath: 'circle(12% at 50% 50%)',
            }),

            animate: {
                opacity: 1,
                scale: 1,
                rotateZ: 0,
                rotateY: 0,
                filter: 'blur(0px) saturate(1)',
                clipPath: 'circle(80% at 50% 50%)',
                transition: {
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                scale: 0.58,
                rotateZ: direction * -10,
                rotateY: direction * -20,
                filter: 'blur(18px) saturate(1.35)',
                clipPath: 'circle(8% at 50% 50%)',
                transition: {
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                },
            }),
        },

        layoutTransition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};
