command: `../list-dirty-repos.sh ~`,

refreshFrequency: '1m',

render: res => {
	const highlights = [
		{ name: 'project',         regex: /^\S+$/gm },
		{ name: 'modified',        regex: /^\t M.+$/gm },
		{ name: 'added',           regex: /^\tA .+$/gm },
		{ name: 'staged',          regex: /^\tM .+$/gm },
		{ name: 'added-modified',  regex: /^\tAM.+$/gm },
		{ name: 'staged-modified', regex: /^\tMM.+$/gm },
		{ name: 'renamed',         regex: /^\tR .+$/gm },
		{ name: 'deleted',         regex: /^\t D.+$/gm },
		{ name: 'untracked',       regex: /^\t\?\?.+$/gm },
	];
	const matches = [];
	for (const highlight of highlights) {
		res = res.replace(highlight.regex, `<span class="${highlight.name}">$&</span>`)
	}
	return `<pre>${res}</pre>`;
},

style: `
-webkit-font-smoothing: antialiased

top: 12px
left: 20px

pre
	margin: 0
	font-family: "Source Code Pro"
	font-size: 12px
	font-weight: 600
	color: whitesmoke
	tab-size: 2

.project
	font-weight: 900
	text-decoration: underline

.modified
	color: darkgray

.added
	color: mediumseagreen

.staged
	color: gold

.added-modified, .staged-modified
	color: mediumvioletred

.renamed
	color: steelblue

.deleted
	color: tomato

.untracked
	color: mediumseagreen
`
