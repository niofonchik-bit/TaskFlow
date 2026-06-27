import type { ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import type { AnimationChoice } from '../model/animation.types';
import { useAnimationVariant } from '../model/useAnimationVariant';
import {
    DEFAULT_PAGE_TRANSITION_ANIMATION,
    PAGE_TRANSITION_ANIMATIONS,
    PAGE_TRANSITION_ANIMATION_NAMES,
    REDUCED_PAGE_TRANSITION_VARIANTS,
    type PageTransitionAnimationName,
    type PageTransitionDirection,
} from '../variants/pageTransitionAnimations';
import styles from './PageTransition.module.css';

interface PageTransitionProps {
    children: ReactNode;
    direction: PageTransitionDirection;
    animation?: AnimationChoice<PageTransitionAnimationName>;
    onAnimationComplete?: () => void;
}

/** анимирует полноэкранный переход между страницами */
export function PageTransition({ children, direction, animation = DEFAULT_PAGE_TRANSITION_ANIMATION, onAnimationComplete }: PageTransitionProps) {
    const reduceMotion = useReducedMotion();

    const animationName = useAnimationVariant(PAGE_TRANSITION_ANIMATION_NAMES, animation);

    const animationConfig = PAGE_TRANSITION_ANIMATIONS[animationName];

    return (
        <div
            className={styles.page_transition_stage}
            style={{
                perspective: animationConfig.perspective,
            }}
        >
            <m.div
                className={styles.page_transition_scene}
                custom={direction}
                variants={reduceMotion ? REDUCED_PAGE_TRANSITION_VARIANTS : animationConfig.variants}
                initial='initial'
                animate='animate'
                exit='exit'
                onAnimationComplete={onAnimationComplete}
            >
                <div className={styles.page_transition_scroll}>{children}</div>
            </m.div>
        </div>
    );
}
