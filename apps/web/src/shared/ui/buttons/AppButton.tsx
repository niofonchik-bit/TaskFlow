import type { ReactNode } from 'react';
import { Box, Button, Stack, type ButtonProps } from '@mui/material';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import type { AnimationChoice } from '../../animation/model/animation.types';
import { useAnimationVariant } from '../../animation/model/useAnimationVariant';
import { ButtonLoadingIndicator } from './ButtonLoadingIndicator';
import { BUTTON_LOADING_ANIMATION_NAMES, type ButtonLoadingAnimationName } from './buttonLoadingAnimations';

interface AppButtonProps extends ButtonProps {
    isLoading?: boolean;
    loadingText?: ReactNode;
    loadingAnimation?: AnimationChoice<ButtonLoadingAnimationName>;
}

/** отображает стандартную кнопку приложения */
export function AppButton({
    children,
    startIcon,
    endIcon,
    disabled,
    isLoading = false,
    loadingText = 'Загрузка...',
    loadingAnimation = 'random',
    sx,
    ...buttonProps
}: AppButtonProps) {
    const selectedLoadingAnimation = useAnimationVariant(BUTTON_LOADING_ANIMATION_NAMES, loadingAnimation);

    const additionalSx = Array.isArray(sx) ? sx : sx ? [sx] : [];

    return (
        <Button
            {...buttonProps}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            sx={[
                {
                    position: 'relative',
                    overflow: 'hidden',
                },
                ...additionalSx,
            ]}
        >
            <Box
                component='span'
                sx={{
                    display: 'grid',
                    width: '100%',
                    placeItems: 'center',
                }}
            >
                <Stack
                    component='span'
                    direction='row'
                    spacing={1}
                    sx={{
                        gridArea: '1 / 1',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isLoading ? 0 : 1,
                        transform: isLoading ? 'scale(0.92)' : 'scale(1)',
                        transition: 'opacity 180ms ease, transform 220ms ease',
                    }}
                >
                    {startIcon}

                    <Box component='span'>{children}</Box>

                    {endIcon}
                </Stack>

                <AnimatePresence initial={false}>
                    {isLoading && (
                        <m.span
                            key='loading'
                            initial={{
                                opacity: 0,
                                scale: 0.72,
                                y: 6,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.72,
                                y: -6,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 480,
                                damping: 30,
                            }}
                            style={{
                                display: 'flex',
                                gridArea: '1 / 1',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ButtonLoadingIndicator
                                animation={selectedLoadingAnimation}
                                label={loadingText}
                            />
                        </m.span>
                    )}
                </AnimatePresence>
            </Box>
        </Button>
    );
}
