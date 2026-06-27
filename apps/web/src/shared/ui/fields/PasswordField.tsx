import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { mdiEyeOffOutline, mdiEyeOutline, mdiLockOutline } from '@mdi/js';
import type { AnimationChoice } from '../../animation/model/animation.types';
import { AnimatedIcon } from '../../animation/ui/AnimatedIcon';
import type { IconSwapAnimationName } from '../../animation/variants/iconSwapAnimations';
import { AppIcon } from '../AppIcon';
import { AppTextField, type AppTextFieldProps } from './AppTextField';

interface PasswordFieldProps extends Omit<AppTextFieldProps, 'type' | 'startIcon'> {
    iconAnimation?: AnimationChoice<IconSwapAnimationName>;
}

/** отображает поле пароля с анимированной сменой иконки */
export function PasswordField({ iconAnimation, ...inputProps }: PasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <AppTextField
            {...inputProps}
            type={isVisible ? 'text' : 'password'}
            startIcon={
                <AppIcon
                    path={mdiLockOutline}
                    sx={{
                        color: 'text.secondary',
                        fontSize: 19,
                    }}
                />
            }
            endAdornment={
                <InputAdornment position='end'>
                    <IconButton
                        edge='end'
                        aria-label={isVisible ? 'Скрыть пароль' : 'Показать пароль'}
                        onMouseDown={(event) => {
                            event.preventDefault();
                        }}
                        onClick={() => {
                            setIsVisible((currentValue) => !currentValue);
                        }}
                    >
                        <AnimatedIcon
                            iconKey={isVisible ? 'visible' : 'hidden'}
                            animation={iconAnimation}
                        >
                            <AppIcon
                                path={isVisible ? mdiEyeOffOutline : mdiEyeOutline}
                                sx={{ fontSize: 20 }}
                            />
                        </AnimatedIcon>
                    </IconButton>
                </InputAdornment>
            }
        />
    );
}
