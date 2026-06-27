import type { TargetAndTransition, Transition } from 'motion/react';
import type { AnimationCollection } from '../../../shared/animation/model/animation.types';

export type AuthBackgroundAnimationName = 'drift' | 'orbit' | 'sway' | 'breathe' | 'wave';

interface AuthBackgroundAnimation {
    animate: TargetAndTransition;
    transition: Transition;
}

export const AUTH_BACKGROUND_ANIMATION_NAMES = [
    'drift',
    'orbit',
    'sway',
    'breathe',
    'wave',
] as const satisfies AnimationCollection<AuthBackgroundAnimationName>;

export const AUTH_BACKGROUND_ANIMATIONS: Record<AuthBackgroundAnimationName, AuthBackgroundAnimation> = {
    drift: {
        animate: {
            x: [0, 12, -5, 0],
            y: [0, -14, -6, 0],
            rotate: [-3, 1.5, -1, -3],
        },

        transition: {
            duration: 20,
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: 'easeInOut',
        },
    },

    orbit: {
        animate: {
            x: [0, 14, 0, -10, 0],
            y: [0, 5, -12, 4, 0],
            rotate: [2, 4, 1, -2, 2],
        },

        transition: {
            duration: 24,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
        },
    },

    sway: {
        animate: {
            x: [0, -9, 8, 0],
            y: [0, -10, -17, 0],
            rotate: [-1, -4, 3, -1],
        },

        transition: {
            duration: 22,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
        },
    },

    breathe: {
        animate: {
            y: [0, -9, 0],
            scale: [1, 1.025, 1],
            rotate: [1, -1, 1],
        },

        transition: {
            duration: 18,
            repeat: Infinity,
            repeatDelay: 3.5,
            ease: 'easeInOut',
        },
    },

    wave: {
        animate: {
            x: [0, 7, -7, 0],
            y: [0, -8, -14, 0],
            rotate: [-3, 2, -2, -3],
            scale: [1, 0.99, 1.015, 1],
        },

        transition: {
            duration: 21,
            repeat: Infinity,
            repeatDelay: 2.75,
            ease: 'easeInOut',
        },
    },
};
