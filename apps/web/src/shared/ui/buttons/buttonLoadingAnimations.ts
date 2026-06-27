import type { AnimationCollection } from '../../animation/model/animation.types';

export type ButtonLoadingAnimationName = 'orbit' | 'dots' | 'shimmer' | 'progress' | 'pulse';

export const BUTTON_LOADING_ANIMATION_NAMES = [
    'orbit',
    'dots',
    'shimmer',
    'progress',
    'pulse',
] as const satisfies AnimationCollection<ButtonLoadingAnimationName>;
