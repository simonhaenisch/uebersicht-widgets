import { css } from 'uebersicht';

export const command = `/usr/local/bin/node ../get-github-notifications`;

export const refreshFrequency = 60 * 1000;

export const render = ({ output, error }) => <div dangerouslySetInnerHTML={{ __html: error || output }} />;

export const className = css`
	-webkit-font-smoothing: antialiased;

	bottom: 12px;
	left: 20px;

	a {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-gap: 0.25em 0.5em;
		text-decoration: none;

		svg {
			fill: whitesmoke;
		}

		pre {
			margin: 0;
			font-family: 'Source Code Pro';
			font-size: 12px;
			font-weight: 600;
			color: darkgray;
			tab-size: 2;

			span {
				color: whitesmoke;
			}
		}
	}
`;
