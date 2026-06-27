import type { Transition } from 'motion/react';
import type { AnimationCollection } from '../../../shared/animation/model/animation.types';

export type AuthModeSwitchAnimationName = 'soft' | 'elastic' | 'glide' | 'snap' | 'bounce';

export const AUTH_MODE_SWITCH_ANIMATION_NAMES = [
    'soft',
    'elastic',
    'glide',
    'snap',
    'bounce',
] as const satisfies AnimationCollection<AuthModeSwitchAnimationName>;

export const AUTH_MODE_SWITCH_ANIMATIONS: Record<AuthModeSwitchAnimationName, Transition> = {
    soft: {
        type: 'spring',
        stiffness: 310,
        damping: 32,
    },

    elastic: {
        type: 'spring',
        stiffness: 380,
        damping: 22,
        mass: 0.75,
    },

    glide: {
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
    },

    snap: {
        type: 'spring',
        stiffness: 620,
        damping: 38,
        mass: 0.55,
    },

    bounce: {
        type: 'spring',
        stiffness: 420,
        damping: 18,
        mass: 0.75,
    },
};
