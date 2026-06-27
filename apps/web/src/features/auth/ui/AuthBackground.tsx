import type { CSSProperties } from 'react';
import { Box, Stack } from '@mui/material';
import { useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { useAnimationVariant } from '../../../shared/animation/model/useAnimationVariant';
import { AUTH_BACKGROUND_ANIMATIONS, AUTH_BACKGROUND_ANIMATION_NAMES } from '../animation/authBackgroundAnimations';
import styles from './auth-shell/AuthShell.module.css';

interface BackgroundPosition {
    top?: CSSProperties['top'];
    right?: CSSProperties['right'];
    bottom?: CSSProperties['bottom'];
    left?: CSSProperties['left'];
}

interface FloatingCardConfig {
    id: string;
    position: BackgroundPosition;
    accentColor: string;
    animationDelay: number;
}

const FLOATING_CARDS: FloatingCardConfig[] = [
    {
        id: 'planning',
        position: {
            top: '13%',
            left: '6%',
        },
        accentColor: '#F2734D',
        animationDelay: 0,
    },
    {
        id: 'review',
        position: {
            top: '18%',
            right: '7%',
        },
        accentColor: '#4FA6A0',
        animationDelay: 0.7,
    },
    {
        id: 'design',
        position: {
            bottom: '13%',
            left: '9%',
        },
        accentColor: '#8A78D8',
        animationDelay: 1.4,
    },
    {
        id: 'complete',
        position: {
            right: '9%',
            bottom: '16%',
        },
        accentColor: '#5BA86A',
        animationDelay: 2.1,
    },
];

interface AuthFloatingCardProps {
    config: FloatingCardConfig;
}

/** отображает одну декоративную карточку */
function AuthFloatingCard({ config }: AuthFloatingCardProps) {
    const reduceMotion = useReducedMotion();

    const animationName = useAnimationVariant(AUTH_BACKGROUND_ANIMATION_NAMES);

    const animation = AUTH_BACKGROUND_ANIMATIONS[animationName];

    return (
        <m.div
            className={styles.auth_floating_card}
            style={config.position}
            animate={reduceMotion ? undefined : animation.animate}
            transition={
                reduceMotion
                    ? undefined
                    : {
                          ...animation.transition,
                          delay: config.animationDelay,
                      }
            }
        >
            <Box
                sx={[
                    {
                        p: '14px',
                        border: '1px solid rgba(120, 72, 45, 0.08)',
                        borderRadius: '18px',
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 14px 30px -18px rgba(120, 72, 45, 0.3)',
                    },

                    (theme) =>
                        theme.applyStyles('dark', {
                            borderColor: 'rgba(255, 244, 236, 0.08)',
                            bgcolor: 'rgba(45, 36, 31, 0.94)',
                            boxShadow: '0 16px 34px -20px rgba(0, 0, 0, 0.68)',
                        }),
                ]}
            >
                <Stack spacing={1}>
                    <Stack
                        direction='row'
                        spacing={1}
                        sx={{
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                width: 11,
                                height: 11,
                                flex: '0 0 auto',
                                borderRadius: '4px',
                                bgcolor: config.accentColor,
                            }}
                        />

                        <Box
                            sx={[
                                {
                                    width: 62,
                                    height: 7,
                                    borderRadius: '4px',
                                    bgcolor: '#D9CEC5',
                                },

                                (theme) =>
                                    theme.applyStyles('dark', {
                                        bgcolor: 'rgba(255, 244, 236, 0.26)',
                                    }),
                            ]}
                        />
                    </Stack>

                    <Box
                        sx={[
                            {
                                height: 6,
                                borderRadius: '4px',
                                bgcolor: '#E8DED5',
                            },

                            (theme) =>
                                theme.applyStyles('dark', {
                                    bgcolor: 'rgba(255, 244, 236, 0.18)',
                                }),
                        ]}
                    />

                    <Box
                        sx={[
                            {
                                width: '64%',
                                height: 6,
                                borderRadius: '4px',
                                bgcolor: '#E8DED5',
                            },

                            (theme) =>
                                theme.applyStyles('dark', {
                                    bgcolor: 'rgba(255, 244, 236, 0.18)',
                                }),
                        ]}
                    />
                </Stack>
            </Box>
        </m.div>
    );
}

/** отображает декоративный фон страницы авторизации */
export function AuthBackground() {
    return (
        <Box
            aria-hidden='true'
            className={styles.auth_background}
        >
            {FLOATING_CARDS.map((config) => (
                <AuthFloatingCard
                    key={config.id}
                    config={config}
                />
            ))}
        </Box>
    );
}
