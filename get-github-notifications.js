#!/usr/bin/env node

// @ts-check

import octicons from '@primer/octicons';
import anybar from 'anybar';
import { config } from 'dotenv';
import fetch from 'node-fetch';

config({ path: new URL('.env', import.meta.url).pathname });

async function main() {
	/**
	 * @type {import('@octokit/types').Endpoints['GET /notifications']['response']['data']}
	 */
	const notifications = await fetch('https://api.github.com/notifications', {
		headers: {
			Accept: 'application/vnd.github.v3+json',
			Authorization: `token ${process.env.GITHUB_TOKEN}`,
		},
	}).then((res) => res.json());

	const output = notifications
		.map((notification) => {
			const url = new URL('https://github.com');

			if (notification.subject.url) {
				url.pathname = new URL(notification.subject.url).pathname.replace('/repos', '');
			} else {
				url.pathname = '/notifications';
				url.searchParams.append('query', `repo:${notification.repository.full_name}`);
			}

			return {
				repo: notification.repository.full_name,
				subject: notification.subject.title,
				type: notification.subject.type,
				url,
			};
		})
		.map(
			(n) =>
				`<a href="${n.url.toString()}">${getOcticonSvg(n.type)}<pre><span>${n.repo}</span>: ${n.subject}</pre></a>`,
		)
		.join('\n');

	console.log(output);

	await anybar(notifications.length > 0 ? 'white' : 'black');
}

/**
 * @param {string} type
 */
const getOcticonSvg = (type) => octicons[icons.get(type)].toSVG();

const icons = new Map([
	['CheckSuite', 'workflow'],
	['Commit', 'git-commit'],
	['Issue', 'issue-opened'],
	['PullRequest', 'git-pull-request'],
	['RepositoryDependabotAlertsThread', 'alert'],
]);

main().catch((err) => process.exit(1));
