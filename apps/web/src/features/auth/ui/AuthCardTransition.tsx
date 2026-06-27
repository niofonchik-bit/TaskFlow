import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import type { AnimationChoice } from '../../../shared/animation/model/animation.types';
import { useAnimationVariant } from '../../../shared/animation/model/useAnimationVariant';
import {
    AUTH_CARD_SWITCH_ANIMATIONS,
    AUTH_CARD_SWITCH_ANIMATION_NAMES,
    DEFAULT_AUTH_CARD_SWITCH_ANIMATION,
    type AuthCardSwitchAnimationName,
    type AuthCardSwitchCustom,
} from '../animation/authCardSwitchAnimations';
import type { AuthMode } from '../model/auth.types';
import { AuthCard } from './auth-shell/AuthCard';
import styles from './auth-shell/AuthShell.module.css';

interface AuthCardTransitionProps {
    mode: AuthMode;
    direction: 1 | -1;
    children: ReactNode;
    animation?: AnimationChoice<AuthCardSwitchAnimationName>;
}

/** анимирует содержимое постоянной карточки авторизации */
export function AuthCardTransition({ mode, direction, children, animation = DEFAULT_AUTH_CARD_SWITCH_ANIMATION }: AuthCardTransitionProps) {
    const animationName = useAnimationVariant(AUTH_CARD_SWITCH_ANIMATION_NAMES, animation);

    const animationConfig = AUTH_CARD_SWITCH_ANIMATIONS[animationName];

    const custom: AuthCardSwitchCustom = {
        direction,
    };

    return (
        <Box className={styles.auth_transition_stage}>
            <m.div
                layout='size'
                className={styles.auth_transition_content}
                transition={{
                    layout: animationConfig.layoutTransition,
                }}
                style={{
                    transformOrigin: 'top center',
                }}
            >
                <AuthCard>
                    <AnimatePresence
                        initial={false}
                        mode='popLayout'
                        custom={custom}
                    >
                        <m.div
                            key={mode}
                            custom={custom}
                            variants={animationConfig.variants}
                            initial='initial'
                            animate='animate'
                            exit='exit'
                            style={{
                                width: '100%',
                            }}
                        >
                            {children}
                        </m.div>
                    </AnimatePresence>
                </AuthCard>
            </m.div>
        </Box>
    );
}
