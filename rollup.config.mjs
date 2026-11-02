import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

const dev = !!process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/sidebar-card.js',
    format: 'es',
    inlineDynamicImports: true,
  },
  plugins: [
    replace({ preventAssignment: true, values: { __VERSION__: JSON.stringify(version) } }),
    resolve(),
    typescript(),
    !dev && terser({ format: { comments: false } }),
  ],
};
