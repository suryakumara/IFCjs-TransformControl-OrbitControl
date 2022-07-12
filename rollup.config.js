import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'esm',
      file: 'public/bundle.js'
    },
  ],
  plugins: [
    resolve(),
  ]
};