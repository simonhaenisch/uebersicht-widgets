import { css, run } from 'uebersicht';

export const refreshFrequency = 5 * 60 * 1000; // 288 requests per day

export const render = ({ output, error }) => (
	<pre className={preStyles} dangerouslySetInnerHTML={{ __html: error || output }} />
);

export const initialState = { output: 'Loading weather forecast...' };

export const init = (dispatch) => {
	geolocation.getCurrentPosition((res) => {
		const lat = res.position.coords.latitude;
		const lng = res.position.coords.longitude;
		const name = `${res.address.city}, ${res.address.country}`;

		run(
			`PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH" ../get-weather.js '${JSON.stringify({ lat, lng, name })}'`,
		).then((output) => dispatch({ output }));
	}, console.error);
};

export const className = css`
	-webkit-font-smoothing: antialiased;

	top: 50%;
	margin-top: 124px;
	left: 50%;
	margin-left: -554px;
	width: 1108px;
`;

const preStyles = css`
	margin: 0;
	font-family: 'ui-monospace';
	font-size: 24px;
	font-weight: 900;
	color: whitesmoke;
	white-space: pre-wrap;
`;
