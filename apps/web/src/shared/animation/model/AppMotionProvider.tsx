import type { ReactNode } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';

interface AppMotionProviderProps {
    children: ReactNode;
}

/** загружает DOM-возможности Motion отдельным чанком */
function loadMotionFeatures() {
    return import('./motionFeatures').then((module) => module.default);
}

/** подключает общую систему анимаций приложения */
export function AppMotionProvider({ children }: AppMotionProviderProps) {
    return (
        <LazyMotion
            features={loadMotionFeatures}
            strict
        >
            <MotionConfig reducedMotion='user'>{children}</MotionConfig>
        </LazyMotion>
    );
}
