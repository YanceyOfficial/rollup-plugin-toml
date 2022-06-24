import typescript from '@rollup/plugin-typescript'
const pkg = require('./package.json')

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/index.js',
  output: [
    { file: pkg.main, format: 'cjs', sourcemap: true, exports: 'auto' },
    { file: pkg.module, format: 'es', sourcemap: true },
  ],
  plugins: [
    /**
     * @type {import('@rollup/plugin-typescript').RollupTypescriptOptions}
     */
    typescript({
      outputToFilesystem: true,
      tsconfig: './tsconfig.json',
    }),
  ],
  external: Object.keys(pkg.dependencies),
}

export default config
