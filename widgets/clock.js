command: ``,

refreshFrequency: false,

render: res => `<pre id="clock"></pre>`,

update: (/*res, el*/) => {
	renderClock();

	// calculate time to wait till next minute
	const t = Date.now();
	const msToWait = Math.ceil((Math.ceil(t / 1000) - (t / 1000)) * 1000);
	const secsToWait = 60 - Math.ceil(t / 1000) % 60;
	const timeToWait = msToWait + 1000 * secsToWait;

	// wait till next minute
	setTimeout(() => {
		renderClock();
		// update every 60 seconds from now on
		setInterval(renderClock, 60 * 1000);
	}, timeToWait);

	// function to render the clock
	function renderClock() {
		const now = new Date();
		const hh = now.getHours().toString().padStart(2, '0');
		const mm = now.getMinutes().toString().padStart(2, '0');
		document.getElementById('clock').textContent = `${hh}:${mm}`;
	}
},

style: `
-webkit-font-smoothing: antialiased

top: 50%
margin-top: -110px
left: 50%
margin-left: -570px

pre
	margin: 0
	font-family: "Source Code Pro"
	font-size: 283px
	font-weight: 900
	color: #222
	line-height: 0.62
`
