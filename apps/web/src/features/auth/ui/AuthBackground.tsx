import type { CSSProperties } from 'react';
import { Box, Stack } from '@mui/material';
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

interface BlobConfig {
    id: string;
    position: BackgroundPosition;
    size: number;
    lightBackground: string;
    darkBackground: string;
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

const BLOBS: BlobConfig[] = [
    {
        id: 'primary',
        position: {
            top: '48%',
            left: '-8%',
        },
        size: 420,
        lightBackground: 'radial-gradient(circle, rgba(242, 115, 77, 0.16), transparent 68%)',
        darkBackground: 'radial-gradient(circle, rgba(255, 137, 102, 0.13), transparent 68%)',
        animationDelay: 0,
    },
    {
        id: 'secondary',
        position: {
            top: '6%',
            right: '-7%',
        },
        size: 460,
        lightBackground: 'radial-gradient(circle, rgba(244, 162, 59, 0.15), transparent 68%)',
        darkBackground: 'radial-gradient(circle, rgba(111, 193, 187, 0.10), transparent 68%)',
        animationDelay: 1.8,
    },
];

interface AuthFloatingCardProps {
    config: FloatingCardConfig;
}

/** отображает одну декоративную карточку */
function AuthFloatingCard({ config }: AuthFloatingCardProps) {
    const animationName = useAnimationVariant(AUTH_BACKGROUND_ANIMATION_NAMES);

    const animation = AUTH_BACKGROUND_ANIMATIONS[animationName];

    return (
        <m.div
            className={styles.auth_floating_card}
            style={config.position}
            animate={animation.animate}
            transition={{
                ...animation.transition,
                delay: config.animationDelay,
            }}
        >
            <Box
                sx={[
                    {
                        p: '14px',
                        border: '1px solid rgba(120, 72, 45, 0.08)',
                        borderRadius: '18px',
                        bgcolor: 'rgba(255, 255, 255, 0.72)',
                        boxShadow: '0 20px 40px -18px rgba(120, 72, 45, 0.26)',
                        backdropFilter: 'blur(8px)',
                    },

                    (theme) =>
                        theme.applyStyles('dark', {
                            borderColor: 'rgba(255, 244, 236, 0.08)',
                            bgcolor: 'rgba(45, 36, 31, 0.74)',
                            boxShadow: '0 22px 48px -20px rgba(0, 0, 0, 0.72)',
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

interface AuthBlobProps {
    config: BlobConfig;
}

/** отображает одно декоративное свечение */
function AuthBlob({ config }: AuthBlobProps) {
    const animationName = useAnimationVariant(AUTH_BACKGROUND_ANIMATION_NAMES);

    const animation = AUTH_BACKGROUND_ANIMATIONS[animationName];

    return (
        <m.div
            className={styles.auth_blob}
            style={{
                ...config.position,
                width: config.size,
                height: config.size,
            }}
            animate={animation.animate}
            transition={{
                ...animation.transition,
                delay: config.animationDelay,
            }}
        >
            <Box
                sx={[
                    {
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: config.lightBackground,
                    },

                    (theme) =>
                        theme.applyStyles('dark', {
                            background: config.darkBackground,
                        }),
                ]}
            />
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
            {BLOBS.map((config) => (
                <AuthBlob
                    key={config.id}
                    config={config}
                />
            ))}

            {FLOATING_CARDS.map((config) => (
                <AuthFloatingCard
                    key={config.id}
                    config={config}
                />
            ))}
        </Box>
    );
}
