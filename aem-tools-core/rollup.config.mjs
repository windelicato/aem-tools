import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';
import { builtinModules } from 'module';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/aem-tools-core.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      inlineDynamicImports: true,
    },
    {
      file: 'dist/aem-tools-core.mjs',
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  external: [...builtinModules, ...Object.keys(pkg.dependencies || {})],
  plugins: [nodeResolve({ preferBuiltins: true }), commonjs(), typescript({ tsconfig: './tsconfig.json' })],
};
