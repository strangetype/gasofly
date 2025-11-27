import { defineConfig } from 'vite';
import path from 'path';
import { modeResolverPlugin } from './vite-plugins/mode-resolver';

export default defineConfig({
	plugins: [modeResolverPlugin()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		port: 3000,
		open: true,
	},
	build: {
		outDir: 'dist',
		sourcemap: true,
	},
});

