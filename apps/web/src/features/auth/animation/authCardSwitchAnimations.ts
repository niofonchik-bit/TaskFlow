import type { Transition, Variants } from 'motion/react';
import type { AnimationCollection } from '../../../shared/animation/model/animation.types';

export type AuthCardSwitchAnimationName = 'fade' | 'slide';

export interface AuthCardSwitchCustom {
    direction: 1 | -1;
}

interface AuthCardSwitchAnimation {
    variants: Variants;
    layoutTransition: Transition;
}

export const AUTH_CARD_SWITCH_ANIMATION_NAMES = ['fade', 'slide'] as const satisfies AnimationCollection<AuthCardSwitchAnimationName>;

export const DEFAULT_AUTH_CARD_SWITCH_ANIMATION: AuthCardSwitchAnimationName = 'fade';

export const AUTH_CARD_SWITCH_ANIMATIONS: Record<AuthCardSwitchAnimationName, AuthCardSwitchAnimation> = {
    fade: {
        variants: {
            initial: {
                opacity: 0,
                y: 12,
                scale: 0.995,
            },

            animate: {
                opacity: 1,
                y: 0,
                scale: 1,

                transition: {
                    delay: 0.06,
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                },
            },

            exit: {
                opacity: 0,
                y: -7,
                scale: 0.992,

                transition: {
                    duration: 0.16,
                    ease: [0.4, 0, 1, 1],
                },
            },
        },

        layoutTransition: {
            type: 'spring',
            stiffness: 260,
            damping: 31,
            mass: 0.86,
        },
    },

    slide: {
        variants: {
            initial: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * 18,
                y: 6,
                scale: 0.993,
            }),

            animate: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,

                transition: {
                    delay: 0.04,
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                },
            },

            exit: ({ direction }: AuthCardSwitchCustom) => ({
                opacity: 0,
                x: direction * -14,
                y: -4,
                scale: 0.994,

                transition: {
                    duration: 0.17,
                    ease: [0.4, 0, 1, 1],
                },
            }),
        },

        layoutTransition: {
            type: 'spring',
            stiffness: 255,
            damping: 31,
            mass: 0.88,
        },
    },
};
