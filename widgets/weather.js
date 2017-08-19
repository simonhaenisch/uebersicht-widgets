command: `echo Loading weather forecast...`,

refreshFrequency: '5m', // 288 requests per day

render: res => `<pre>${res}</pre>`,

afterRender: function (/*el*/) {
	geolocation.getCurrentPosition(res => {
		const lat = res.position.coords.latitude;
		const lng = res.position.coords.longitude;
		const name = `${res.address.city}, ${res.address.country}`;

		this.command = `/usr/local/bin/node ../get-weather.js '{ "lat": ${lat}, "lng": ${lng}, "name": "${name}" }'`;
		this.refresh();
	}, err => console.error(err));
},

update: (res/*, el*/) => {
	el.querySelector('pre').textContent = res;
},

style: `
-webkit-font-smoothing: antialiased

top: 50%
margin-top: 124px
left: 50%
margin-left: -554px
width: 66%

pre
	margin: 0
	font-family: "Source Code Pro"
	font-size: 24px
	font-weight: 900
	color: #222
	white-space: pre-wrap
`
