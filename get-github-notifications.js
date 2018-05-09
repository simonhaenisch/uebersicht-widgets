const request = require('request-promise-native');
const anybar = require('anybar');

const server = 'https://api.github.com';
const endpoint = '/notifications';
const auth = {
	user: 'simonhaenisch',
	pass: require('./secrets').github, // (github.com > Settings > Developer Settings > Personal Access Tokens)
};

async function main({ argv }) {
	const requestOptions = {
		headers: {
			'User-Agent': auth.user, // see http://developer.github.com/v3/#user-agent-required
		},
		json: true,
		auth,
	};

	const res = await request(`${server}${endpoint}`, requestOptions);

	await anybar(res.length > 0 ? 'orange' : 'black');

	return 0;
}

main(process)
	.then(process.exit)
	.catch(err => {
		process.exit(1);
	});
