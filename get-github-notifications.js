const request = require('request-promise-native');
const octicons = require('octicons');
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

	const notifications = await request(`${server}${endpoint}`, requestOptions);

	const out = notifications
		.map(notification => ({
			repo: notification.repository.full_name,
			subject: notification.subject.title,
			icon: notification.subject.type === 'PullRequest' ? 'git-pull-request' : 'issue-opened',
		}))
		.map(n => `${octicons[n.icon].toSVG()}<pre><span>${n.repo}</span>: ${n.subject}</pre>`)
		.join('\n');

	console.log(out);

	await anybar(notifications.length > 0 ? 'white' : 'black');

	return 0;
}

main(process)
	.then(process.exit)
	.catch(err => {
		process.exit(1);
	});
