command: `cal -h`,

refreshFrequency: '1m',

render: res => {
	// make heading strong
	res = res.replace(/(.*)\n/, '<strong>$1</strong>\n');
	// underline current day
	const today = new Date().getDate();
	res = res.replace(new RegExp(`(\\s)(${today})(\\s)`), '$1<u>$2</u>$3');

	return `<pre>${res}</pre>`;
},

style: `
-webkit-font-smoothing: antialiased

top: 50%
margin-top: -110px
left: 50%
margin-left: 328px

pre
	margin: 0
	font-family: "Source Code Pro"
	font-size: 19px
	font-weight: 600
	color: darkgray

	strong
	u
		color: whitesmoke
		font-weight: 900
`
