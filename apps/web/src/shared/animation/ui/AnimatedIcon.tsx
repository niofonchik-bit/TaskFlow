import type { Key, ReactNode } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import type { AnimationChoice } from '../model/animation.types';
import { useAnimationVariant } from '../model/useAnimationVariant';
import {
    DEFAULT_ICON_SWAP_ANIMATION,
    ICON_SWAP_ANIMATIONS,
    ICON_SWAP_ANIMATION_NAMES,
    type IconSwapAnimationName,
} from '../variants/iconSwapAnimations';

interface AnimatedIconProps {
    iconKey: Key;
    children: ReactNode;
    animation?: AnimationChoice<IconSwapAnimationName>;
}

/** анимирует замену одной иконки другой */
export function AnimatedIcon({ iconKey, children, animation = DEFAULT_ICON_SWAP_ANIMATION }: AnimatedIconProps) {
    const animationName = useAnimationVariant(ICON_SWAP_ANIMATION_NAMES, animation);

    const animationConfig = ICON_SWAP_ANIMATIONS[animationName];

    return (
        <Box
            component='span'
            sx={{
                display: 'inline-grid',
                placeItems: 'center',
                lineHeight: 0,
                perspective: animationConfig.perspective,
            }}
        >
            <AnimatePresence
                initial={false}
                mode='popLayout'
            >
                <m.span
                    key={iconKey}
                    variants={animationConfig.variants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    transition={animationConfig.transition}
                    style={{
                        display: 'inline-grid',
                        gridArea: '1 / 1',
                        placeItems: 'center',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {children}
                </m.span>
            </AnimatePresence>
        </Box>
    );
}
