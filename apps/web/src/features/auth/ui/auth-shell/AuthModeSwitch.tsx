import { Box, ButtonBase } from '@mui/material';
import { LayoutGroup } from 'motion/react';
import * as m from 'motion/react-m';
import type { AnimationChoice } from '../../../../shared/animation/model/animation.types';
import { useAnimationVariant } from '../../../../shared/animation/model/useAnimationVariant';
import {
    AUTH_MODE_SWITCH_ANIMATIONS,
    AUTH_MODE_SWITCH_ANIMATION_NAMES,
    DEFAULT_AUTH_MODE_SWITCH_ANIMATION,
    type AuthModeSwitchAnimationName,
} from '../../animation/authModeSwitchAnimations';
import type { AuthMode } from '../../model/auth.types';

interface AuthModeSwitchProps {
    mode: AuthMode;
    onChange: (mode: AuthMode) => void;
    animation?: AnimationChoice<AuthModeSwitchAnimationName>;
}

/** переключает вход и регистрацию */
export function AuthModeSwitch({ mode, onChange, animation = DEFAULT_AUTH_MODE_SWITCH_ANIMATION }: AuthModeSwitchProps) {
    const animationName = useAnimationVariant(AUTH_MODE_SWITCH_ANIMATION_NAMES, animation);

    const transition = AUTH_MODE_SWITCH_ANIMATIONS[animationName];

    return (
        <LayoutGroup id='auth_mode_switch'>
            <Box
                sx={{
                    display: 'flex',
                    width: 264,
                    height: 48,
                    mb: 3.75,
                    p: '5px',
                    borderRadius: '14px',
                    bgcolor: 'action.hover',
                    boxShadow: 'inset 0 1px 3px rgba(120, 72, 45, 0.10)',
                }}
            >
                {(
                    [
                        {
                            mode: 'login',
                            label: 'Вход',
                        },
                        {
                            mode: 'register',
                            label: 'Регистрация',
                        },
                    ] as const
                ).map((item) => {
                    const isActive = item.mode === mode;

                    return (
                        <ButtonBase
                            key={item.mode}
                            aria-pressed={isActive}
                            onClick={() => {
                                onChange(item.mode);
                            }}
                            sx={{
                                position: 'relative',
                                flex: 1,
                                overflow: 'hidden',
                                borderRadius: '11px',
                                color: isActive ? 'text.primary' : 'text.secondary',
                                fontSize: '14.5px',
                                fontWeight: 800,
                                transition: 'color 180ms ease',
                            }}
                        >
                            {isActive && (
                                <m.span
                                    layoutId='auth_mode_indicator'
                                    transition={transition}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: 11,
                                        background: 'var(--taskflow-palette-background-paper)',
                                        boxShadow: '0 5px 12px -4px rgba(120, 72, 45, 0.28)',
                                    }}
                                />
                            )}

                            <Box
                                component='span'
                                sx={{
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                {item.label}
                            </Box>
                        </ButtonBase>
                    );
                })}
            </Box>
        </LayoutGroup>
    );
}
