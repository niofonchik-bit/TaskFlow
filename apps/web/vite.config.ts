import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

/** настраивает React и проксирование API-запросов */
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        server: {
            host: '127.0.0.1',
            proxy: {
                '/JS': {
                    target: env.VITE_API_PROXY_TARGET,
                    changeOrigin: true,
                },
            },
        },
        preview: {
            host: '127.0.0.1',
        },
    };
});
