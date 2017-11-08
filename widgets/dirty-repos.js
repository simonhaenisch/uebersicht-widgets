command: `../list-dirty-repos.sh ~`,

refreshFrequency: '5m',

render: res => {
	const highlights = [
		{ name: 'project',         regex: /^\S+$/gm },
		{ name: 'modified',        regex: /^\t M.+$/gm },
		{ name: 'added',           regex: /^\tA .+$/gm },
		{ name: 'staged',          regex: /^\tM .+$/gm },
		{ name: 'added-modified',  regex: /^\tAM.+$/gm },
		{ name: 'staged-modified', regex: /^\tMM.+$/gm },
		{ name: 'untracked',       regex: /^\t\?\?.+$/gm },
	];
	for (const highlight of highlights) {
		for (const match of res.match(highlight.regex) || []) {
			res = res.replace(match, `<span class="${highlight.name}">${match}</span>`);
		}
	}
	return `<pre>${res}</pre>`;
},

style: `
-webkit-font-smoothing: antialiased

top: 20px
left: 20px

pre
	margin: 0
	font-family: "Source Code Pro"
	font-size: 12px
	font-weight: 600
	color: #fff
	tab-size: 2

span.project
	font-weight: 900
	text-decoration: underline

span.modified
	color: darkgray

span.added
	color: yellowgreen

span.staged
	color: gold

span.added-modified, span.staged-modified
	color: orange

span.untracked
	color: crimson
`
