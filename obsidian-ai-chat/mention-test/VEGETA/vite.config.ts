import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	css: {
		postcss: './postcss.config.js',
	},
	build: {
		outDir: "dist",
		emptyOutDir: false,
		sourcemap: false,
		target: "es2018",
		minify: false,
		lib: {
			entry: path.resolve(__dirname, "src/main.tsx"),
			formats: ["cjs"],
			fileName: () => "main.js"
		},
		rollupOptions: {
			external: ["obsidian"],
			output: {
				format: "cjs",
				exports: "default",
				manualChunks: undefined,
				inlineDynamicImports: true
			}
		},
		chunkSizeWarningLimit: 10000
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		}
	}
});
