import type { Transition } from 'motion/react';
import type { AnimationCollection } from '../../../shared/animation/model/animation.types';

export type AuthModeSwitchAnimationName = 'glide' | 'elastic';

export const AUTH_MODE_SWITCH_ANIMATION_NAMES = ['glide', 'elastic'] as const satisfies AnimationCollection<AuthModeSwitchAnimationName>;

export const DEFAULT_AUTH_MODE_SWITCH_ANIMATION: AuthModeSwitchAnimationName = 'glide';

export const AUTH_MODE_SWITCH_ANIMATIONS: Record<AuthModeSwitchAnimationName, Transition> = {
    glide: {
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1],
    },

    elastic: {
        type: 'spring',
        stiffness: 360,
        damping: 25,
        mass: 0.72,
    },
};
