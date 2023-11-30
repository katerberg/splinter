// import { nodeResolve } from "@rollup/plugin-node-resolve";
// import { terser } from "rollup-plugin-terser";
// import babel from "@rollup/plugin-babel";
// import pkg from "./package.json";

// const dts = _dts.default ?? _dts;

// let esbuild = _esbuild; // This in case esbuild is a function
// if (_esbuild.default) { // This if it is an object
//   esbuild = _esbuild.default;
// }


import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from '@rollup/plugin-terser';
import babel from "@rollup/plugin-babel";
import pkg from "./package.json";

const input = ["lib/index.js"];

export default [
  {
    // UMD
    input,
    plugins: [
      nodeResolve(),
      babel({
        babelHelpers: "bundled",
      }),
      terser(),
    ],
    output: {
      file: `dist/${pkg.name}.min.js`,
      format: "umd",
      name: "splinter", // this is the name of the global object
      esModule: false,
      exports: "named",
      sourcemap: true,
    },
  },// ESM and CJS
  {
    input,
    plugins: [nodeResolve()],
    output: [
      {
        dir: "dist/esm",
        format: "esm",
        exports: "named",
        sourcemap: true,
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
  },
];


// export default [
// 	{
// 	  input: `lib/index.js`,
// 	  plugins: [esbuild()],
// 	  output: [
// 		{
// 		  file: `dist/splinter.js`,
// 		  format: 'cjs',
// 		  sourcemap: true,
// 		  exports: 'default',
// 		},
// 	  ],
// 	},
// 	{
// 	  input: `lib/index.js`,
// 	  plugins: [dts()],
// 	  output: {
// 		file: `dist/splinter.d.ts`,
// 		format: 'es',
// 	  },
// 		external: ['rot-js']
// 	},
//   ]

// // export default {
// // 	input: "lib/index.js",
// // 	output: {
// // 		name: "Splinter",
// // 		format: "cjs",
// // 		sourcemap: true,
// // 		exports: 'default',
// // 		file: `dist/splinter.js`,
// // 		globals: {
// // 			'rot-js': 'ROT'
// // 		}
// // 	},
// // 	external: ['rot-js']
// // }
