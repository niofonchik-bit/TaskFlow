import type { ReactNode } from 'react';
import { AnimatePresence, type Transition, type Variants } from 'motion/react';
import * as m from 'motion/react-m';

interface AnimatedContentSwitchProps {
    contentKey: string;
    children: ReactNode;
    variants: Variants;
    custom?: unknown;
    perspective?: number;
    layoutTransition?: Transition;
}

/** анимирует замену одного блока содержимого другим */
export function AnimatedContentSwitch({
    contentKey,
    children,
    variants,
    custom,
    perspective = 1200,
    layoutTransition = {
        type: 'spring',
        stiffness: 280,
        damping: 30,
        mass: 0.8,
    },
}: AnimatedContentSwitchProps) {
    return (
        <m.div
            layout='size'
            transition={{
                layout: layoutTransition,
            }}
            style={{
                position: 'relative',
                width: '100%',
                perspective,
                transformStyle: 'preserve-3d',
            }}
        >
            <AnimatePresence
                initial={false}
                mode='popLayout'
                custom={custom}
            >
                <m.div
                    key={contentKey}
                    custom={custom}
                    variants={variants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                    style={{
                        width: '100%',
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                        willChange: 'transform, opacity, filter',
                    }}
                >
                    {children}
                </m.div>
            </AnimatePresence>
        </m.div>
    );
}
