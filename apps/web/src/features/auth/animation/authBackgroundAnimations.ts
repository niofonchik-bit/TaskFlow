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
            x: [0, 18, -8, 0],
            y: [0, -24, -10, 0],
            rotate: [-4, 2, -1, -4],
        },

        transition: {
            duration: 13,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },

    orbit: {
        animate: {
            x: [0, 22, 0, -18, 0],
            y: [0, 8, -20, 6, 0],
            rotate: [3, 7, 1, -4, 3],
        },

        transition: {
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },

    sway: {
        animate: {
            x: [0, -14, 12, 0],
            y: [0, -18, -30, 0],
            rotate: [-2, -7, 5, -2],
        },

        transition: {
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },

    breathe: {
        animate: {
            y: [0, -14, 0],
            scale: [1, 1.045, 1],
            rotate: [2, -2, 2],
        },

        transition: {
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },

    wave: {
        animate: {
            x: [0, 10, -10, 0],
            y: [0, -12, -24, 0],
            rotate: [-5, 4, -3, -5],
            scale: [1, 0.97, 1.03, 1],
        },

        transition: {
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};
