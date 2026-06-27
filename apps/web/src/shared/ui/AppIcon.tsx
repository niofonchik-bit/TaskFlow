import { SvgIcon, type SvgIconProps } from '@mui/material';

interface AppIconProps extends SvgIconProps {
    path: string;
}

/** отображает mdi-иконку через MUI SvgIcon */
export function AppIcon({ path, ...props }: AppIconProps) {
    return (
        <SvgIcon {...props}>
            <path d={path} />
        </SvgIcon>
    );
}
