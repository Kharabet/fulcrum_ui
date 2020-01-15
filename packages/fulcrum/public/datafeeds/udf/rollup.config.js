/* globals process */

import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from '@rollup/plugin-node-resolve';

var environment = process.env.ENV || 'development';
var isDevelopmentEnv = (environment === 'development');

module.exports = [
	{
		input: 'lib/udf-compatible-datafeed.js',
		output: {
			format: 'iife',
			file: 'dist/bundle.js',
			name: 'Datafeeds',
		},
		plugins: [
			json(),
			resolve({
				preferBuiltins: true,
				browser: true
			}),
			commonjs(),
			builtins(),
			globals(),
			buble(),
		],
	},
	{
		input: 'src/polyfills.es6',
		context: 'window',

		output: {
			format: 'iife',
			file: 'dist/polyfills.js',
			name: 'modul',
		},
		plugins: [
			json(),
			resolve({
				preferBuiltins: true,
				browser: true
			}),
			commonjs(),
			builtins(),
			globals(),
			buble(),
		],
	},
];
