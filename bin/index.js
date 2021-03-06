#!/usr/bin/env node

const Cliy = require('cliy');
const Path = require('path');
const Serve = require('./serve');
// const Bundle = require('./bundle');
const Compile = require('./compile');
const Package = require('../package');

const i = async function (argument, values) {
	const args = argument ? argument.split(' ') : [];

	if (!args[0]) throw new Error('Missing input path parameter');

	values = values || {};

	values.input = Path.resolve(process.cwd(), args[0]);

	return values;
};

const io = async function (argument, values) {
	const args = argument ? argument.split(' ') : [];

	if (!args[0]) throw new Error('Missing input path parameter');
	if (!args[1]) throw new Error('Missing output path parameter');

	values = values || {};

	values.input = Path.resolve(process.cwd(), args[0]);
	values.output = Path.resolve(process.cwd(), args[1]);

	return values;
};

// const operations = {
// 	minify: {
// 		key: 'm',
// 		name: 'minify',
// 		method: function () {
// 			return true;
// 		}
// 	},
// 	comments: {
// 		key: 'c',
// 		name: 'comments',
// 		method: function () {
// 			return false;
// 		}
// 	},
// 	transpile: {
// 		key: 't',
// 		name: 'transpile',
// 		method: function () {
// 			return true;
// 		}
// 	}
// };

(async function() {

	const option = {
		name: 'oxe',
		version: Package.version,
		operations: [
			{
				key: 'c',
				name: 'compile',
				description: 'Compiles to a static project.',
				method: async function (argument, values) {
					const args = argument ? argument.split(' ') : [];

					if (!args[0]) throw new Error('Missing input path parameter');
					if (!args[1]) throw new Error('Missing output path parameter');

					console.log(`\nOxe - Compiling`);

					await Compile(args[0], args[1]);
					
					console.log(`\nOxe - Compiled: from ${args[0]} to ${args[1]}`);
				}
			},
			// {
			// 	key: 'b',
			// 	name: 'bundle',
			// 	description: 'Bundles a project.',
			// 	operations: [
			// 		operations.minify,
			// 		operations.comments,
			// 		operations.transpile,
			// 		{
			// 			key: 'n',
			// 			name: 'name',
			// 			method: function (name) {
			// 				return name;
			// 			}
			// 		}
			// 	],
			// 	method: async function (argument, values) {
			// 		const data = await io(argument, values);
			// 		await Bundle(data);
			// 		console.log('\nOxe Bundling\n');
			// 		console.log(`Bundled: from ${data.input} to ${data.output}`);
			// 	}
			// },
			{
				key: 's',
				name: 'serve',
				description: 'Serves a static or spa project.',
				operations: [
					{
						key: 's',
						name: 'spa',
						method: function () {
							return true;
						}
					},
					{
						key: 'c',
						name: 'cors',
						method: function () {
							return true;
						}
					}
				],
				method: async function (argument, values) {
					const data = await i(argument, values);
					const server = await Serve(data);
					console.log('\nOxe - Serving');
					console.log(`\nOxe - Served: ${server.hostname}:${server.port}`);
				}
			}
		]
	};

	const Program = new Cliy();
	await Program.setup(option);
	await Program.run(process.argv);

}()).catch(console.error);
