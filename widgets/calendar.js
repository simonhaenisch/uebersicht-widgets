command: `cal`,

refreshFrequency: '1m',

render: res => {
	// underline current day
	const today = new Date().getDate()
	const m = res.match(new RegExp(`\\s${today}\\s`))[0]
	const formattedRes = res.replace(m, m.replace(today, `<u>${today}</u>`))

	return `<pre>${formattedRes}</pre>`
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
	font-weight: 700
	color: #222

	u
		font-weight: 900
`
