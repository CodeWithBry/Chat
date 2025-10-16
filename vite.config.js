import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    base: mode === 'production' ? '/Chat/' : '/', // ✅ Correct base for GitHub Pages
    plugins: [
        react({
            babel: {
                plugins: [
                    ['babel-plugin-react-compiler']
                ],
            },
        }),
    ],
    server: {
        proxy: {
            // ✅ For local development — forwards API calls to Express
            '/chat': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
}));