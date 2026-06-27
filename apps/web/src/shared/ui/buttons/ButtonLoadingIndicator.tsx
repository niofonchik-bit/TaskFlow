import type { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import * as m from 'motion/react-m';
import type { ButtonLoadingAnimationName } from './buttonLoadingAnimations';

interface ButtonLoadingIndicatorProps {
    animation: ButtonLoadingAnimationName;
    label: ReactNode;
}

/** отображает выбранную анимацию загрузки кнопки */
export function ButtonLoadingIndicator({ animation, label }: ButtonLoadingIndicatorProps) {
    switch (animation) {
        case 'orbit':
            return (
                <Box
                    component='span'
                    sx={{
                        position: 'relative',
                        width: 24,
                        height: 24,
                    }}
                >
                    <m.span
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 0.8,
                            ease: 'linear',
                            repeat: Infinity,
                        }}
                        style={{
                            position: 'absolute',
                            inset: 1,
                            border: '2px solid currentColor',
                            borderRightColor: 'transparent',
                            borderRadius: '50%',
                        }}
                    />

                    <m.span
                        animate={{
                            opacity: [0.45, 1, 0.45],
                            scale: [0.65, 1, 0.65],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                        }}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            background: 'currentColor',
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </Box>
            );

        case 'dots':
            return (
                <Stack
                    component='span'
                    direction='row'
                    spacing={0.75}
                    sx={{ alignItems: 'center' }}
                >
                    {[0, 1, 2].map((index) => (
                        <m.span
                            key={index}
                            animate={{
                                y: [0, -5, 0],
                                opacity: [0.45, 1, 0.45],
                                scale: [0.85, 1.15, 0.85],
                            }}
                            transition={{
                                duration: 0.72,
                                delay: index * 0.12,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: 'currentColor',
                            }}
                        />
                    ))}
                </Stack>
            );

        case 'progress':
            return (
                <Stack
                    component='span'
                    spacing={0.75}
                    sx={{
                        minWidth: 78,
                        alignItems: 'center',
                    }}
                >
                    <m.span
                        animate={{
                            opacity: [0.55, 1, 0.55],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                        }}
                    >
                        {label}
                    </m.span>

                    <Box
                        component='span'
                        sx={{
                            position: 'relative',
                            width: 54,
                            height: 3,
                            overflow: 'hidden',
                            borderRadius: '4px',
                            bgcolor: 'rgba(255, 255, 255, 0.28)',
                        }}
                    >
                        <m.span
                            animate={{
                                x: ['-110%', '210%'],
                                scaleX: [0.45, 1, 0.45],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '45%',
                                borderRadius: 4,
                                background: 'currentColor',
                                transformOrigin: 'center',
                            }}
                        />
                    </Box>
                </Stack>
            );
    }
}
