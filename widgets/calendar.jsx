import { css } from 'uebersicht';

export const command = `cal -h`;

export const refreshFrequency = 60 * 1000;

export const render = ({ output, error }) => {
	if (error) {
		return <pre className={preStyles}>{error}</pre>;
	}

	// make heading strong
	output = output.replace(/(.*)\n/, '<strong>$1</strong>\n');

	// underline current day
	const today = new Date().getDate();
	output = output.replace(new RegExp(`(\\s)(${today})(\\s)`), '$1<u>$2</u>$3');

	return <pre className={preStyles} dangerouslySetInnerHTML={{ __html: output }} />;
};

export const className = css`
	-webkit-font-smoothing: antialiased;

	top: 50%;
	margin-top: -110px;
	left: 50%;
	margin-left: 328px;
`;

const preStyles = css`
	margin: 0;
	font-family: 'ui-monospace';
	font-size: 19px;
	font-weight: 600;
	color: darkgray;

	strong,
	u {
		color: whitesmoke;
		font-weight: 900;
	}
`;
