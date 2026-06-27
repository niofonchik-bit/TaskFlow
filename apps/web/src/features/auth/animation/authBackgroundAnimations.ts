import type { TargetAndTransition, Transition } from 'motion/react';
import type { AnimationCollection } from '../../../shared/animation/model/animation.types';

export type AuthBackgroundAnimationName = 'drift' | 'breathe';

interface AuthBackgroundAnimation {
    animate: TargetAndTransition;
    transition: Transition;
}

export const AUTH_BACKGROUND_ANIMATION_NAMES = ['drift', 'breathe'] as const satisfies AnimationCollection<AuthBackgroundAnimationName>;

export const DEFAULT_AUTH_BACKGROUND_ANIMATION: AuthBackgroundAnimationName = 'drift';

export const AUTH_BACKGROUND_ANIMATIONS: Record<AuthBackgroundAnimationName, AuthBackgroundAnimation> = {
    drift: {
        animate: {
            x: [0, 10, -4, 0],
            y: [0, -12, -5, 0],
            rotate: [-2.5, 1, -0.5, -2.5],
        },

        transition: {
            duration: 22,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
        },
    },

    breathe: {
        animate: {
            y: [0, -7, 0],
            scale: [1, 1.018, 1],
            rotate: [0.8, -0.8, 0.8],
        },

        transition: {
            duration: 18,
            repeat: Infinity,
            repeatDelay: 4,
            ease: 'easeInOut',
        },
    },
};
