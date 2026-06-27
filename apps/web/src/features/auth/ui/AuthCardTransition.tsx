import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import type { AnimationChoice } from '../../../shared/animation/model/animation.types';
import { useAnimationVariant } from '../../../shared/animation/model/useAnimationVariant';
import { AnimatedContentSwitch } from '../../../shared/animation/ui/AnimatedContentSwitch';
import {
    AUTH_CARD_SWITCH_ANIMATIONS,
    AUTH_CARD_SWITCH_ANIMATION_NAMES,
    type AuthCardSwitchAnimationName,
    type AuthCardSwitchCustom,
} from '../animation/authCardSwitchAnimations';
import type { AuthMode } from '../model/auth.types';
import styles from './auth-shell/AuthShell.module.css';

interface AuthCardTransitionProps {
    mode: AuthMode;
    direction: 1 | -1;
    children: ReactNode;
    animation?: AnimationChoice<AuthCardSwitchAnimationName>;
}

/** анимирует смену формы авторизации */
export function AuthCardTransition({ mode, direction, children, animation = 'random' }: AuthCardTransitionProps) {
    const animationName = useAnimationVariant(AUTH_CARD_SWITCH_ANIMATION_NAMES, animation);

    const animationConfig = AUTH_CARD_SWITCH_ANIMATIONS[animationName];

    const custom: AuthCardSwitchCustom = {
        direction,
    };

    return (
        <Box className={styles.auth_transition_stage}>
            <Box className={styles.auth_transition_content}>
                <AnimatedContentSwitch
                    contentKey={mode}
                    custom={custom}
                    variants={animationConfig.variants}
                    perspective={animationConfig.perspective}
                    layoutTransition={animationConfig.layoutTransition}
                >
                    {children}
                </AnimatedContentSwitch>
            </Box>
        </Box>
    );
}
