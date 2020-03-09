#!/usr/bin/env node

const { join } = require('path');
const request = require('request-promise-native');
const octicons = require('octicons');
const anybar = require('anybar');

require('dotenv').config({ path: join(__dirname, '.env') });

const server = 'https://api.github.com';
const endpoint = '/notifications';
const auth = {
	user: process.env.GITHUB_USER,
	pass: process.env.GITHUB_TOKEN,
};

async function main({ argv }) {
	const requestOptions = {
		headers: { 'User-Agent': auth.user }, // see http://developer.github.com/v3/#user-agent-required
		json: true,
		auth,
	};

	const notifications = await request(`${server}${endpoint}`, requestOptions);

	const out = notifications
		.filter(n => n.unread)
		.map(notification => ({
			repo: notification.repository.full_name,
			subject: notification.subject.title,
			url: notification.subject.url
				? notification.subject.url.replace('https://api.', 'https://').replace('/repos', '')
				: `https://github.com/${notification.repository.full_name}`,
			icon: notification.subject.type === 'PullRequest' ? 'git-pull-request' : 'issue-opened',
		}))
		.map(n => `<a href="${n.url}">${octicons[n.icon].toSVG()}<pre><span>${n.repo}</span>: ${n.subject}</pre></a>`)
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
