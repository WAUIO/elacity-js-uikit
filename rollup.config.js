import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import image from "@rollup/plugin-image";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";
import svg from "rollup-plugin-svg-import";
// import { terser } from "rollup-plugin-terser";

const packageJson = require("./package.json");

export default [
  {
    input: "src/index.ts",
    output: [
      {
        // file: packageJson.module,
        format: "esm",
        sourcemap: true,
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src'
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      svg(),
      typescript({
        tsconfig: "./tsconfig.json",
        declarationDir: "dist"
      }),
      postcss({
        extensions: [".css"],
      }),
      image(),
      // terser(),
    ]
  },
  {
    input: "dist/index.d.ts",
    output: [{
      file: "dist/types.d.ts",
      format: "esm"
    }],
    plugins: [
      dts()
    ],
  },
];