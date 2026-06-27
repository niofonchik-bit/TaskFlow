import { useId, type ReactNode } from 'react';
import { FormControl, FormHelperText, FormLabel, InputAdornment, OutlinedInput, type OutlinedInputProps } from '@mui/material';

export interface AppTextFieldProps extends Omit<OutlinedInputProps, 'label' | 'startAdornment'> {
    label: string;
    startIcon?: ReactNode;
    helperText?: ReactNode;
}

/** отображает стандартное поле приложения */
export function AppTextField({ id, label, startIcon, helperText, required, error, sx, ...inputProps }: AppTextFieldProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helperId = `${inputId}_helper`;

    const additionalSx = Array.isArray(sx) ? sx : sx ? [sx] : [];

    return (
        <FormControl
            fullWidth
            error={error}
        >
            <FormLabel
                htmlFor={inputId}
                sx={{
                    mb: 0.75,
                    color: 'text.secondary',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',

                    '&.Mui-focused': {
                        color: 'text.secondary',
                    },
                }}
            >
                {label}
                {required ? ' *' : ''}
            </FormLabel>

            <OutlinedInput
                {...inputProps}
                id={inputId}
                required={required}
                aria-describedby={helperText ? helperId : undefined}
                startAdornment={startIcon ? <InputAdornment position='start'>{startIcon}</InputAdornment> : undefined}
                sx={[
                    {
                        height: 48,
                        borderRadius: '14px',
                        bgcolor: 'action.hover',

                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'divider',
                            borderWidth: '1.5px',
                        },

                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'text.secondary',
                        },

                        '&.Mui-focused': {
                            bgcolor: 'background.paper',
                            boxShadow: '0 0 0 4px rgba(242, 115, 77, 0.16)',
                        },

                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                    },
                    ...additionalSx,
                ]}
            />

            {helperText && (
                <FormHelperText
                    id={helperId}
                    sx={{ mx: 0 }}
                >
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
}
