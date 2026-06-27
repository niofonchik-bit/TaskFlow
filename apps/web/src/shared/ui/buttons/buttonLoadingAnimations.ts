import type { AnimationCollection } from '../../animation/model/animation.types';

export type ButtonLoadingAnimationName = 'orbit' | 'dots' | 'progress';

export const BUTTON_LOADING_ANIMATION_NAMES = ['orbit', 'dots', 'progress'] as const satisfies AnimationCollection<ButtonLoadingAnimationName>;

export const DEFAULT_BUTTON_LOADING_ANIMATION: ButtonLoadingAnimationName = 'orbit';
