// config
const config = {
	API_KEY: 'ENTER_YOUR_DARK_SKY_API_KEY_HERE',
	UNITS: 'si', // or 'us' for Fahrenheit
};

// load packages
const querystring = require('querystring');
const fetch = require('nofetch');
const moment = require('moment');

// get location object from cli argument (JSON string), or default to Berlin
const location = process.argv[2]
	? JSON.parse(process.argv[2])
	: { name: 'Berlin, Germany', lat: 52.5069704, lng: 13.28465 };

// self–calling async main function
(async function main() {
	try {
		// get weather info from darksky for given location
		const weather = await (await fetch(
			`https://api.darksky.net/forecast/${config.API_KEY}/${location.lat},${location.lng}?units=${config.UNITS}&exclude=minutely,hourly,alerts`,
		)).json();

		// find data for today and tomorrow
		let today = weather.daily.data.find(data => moment.unix(data.time).isSame(moment(), 'day'));
		let tomorrow = weather.daily.data.find(data => moment.unix(data.time).isSame(moment().add(1, 'days'), 'day'));

		const deg = weather.flags.units === 'si' ? '°C' : '°F';

		const current = {
			temp: Math.round(weather.currently.temperature),
			skyText: weather.currently.summary.toLowerCase(),
			uvi: weather.currently.uvIndex,
		};

		today = {
			high: Math.round(today.temperatureHigh),
			low: Math.round(today.temperatureLow),
			forecast: today.summary.toLowerCase().replace('.', ''),
			uvi: today.uvIndex, // max of the day
			uviTime: moment.unix(today.uvIndexTime).format('h A'),
		};

		tomorrow = {
			high: Math.round(tomorrow.temperatureHigh),
			low: Math.round(tomorrow.temperatureLow),
			forecast: tomorrow.summary.toLowerCase().replace('.', ''),
		};

		let res = `In <u>${location.name}</u> it's <u>${current.temp}${deg}</u> and <u>${current.skyText}</u> right now.`;

		if (moment().hours() < 21) {
			res += ` Today it will be <u>${today.forecast}</u> with a forecast high of <u>${today.high}${deg}</u> and a low of <u>${today.low}${deg}.`;
		} else {
			// after 9 PM
			res += ` Tomorrow it will be <u>${tomorrow.forecast}</u> with a forecast high of <u>${tomorrow.high}${deg}</u> and a low of <u>${tomorrow.low}${deg}</u>.`;
		}

		console.log(res);
	} catch (error) {
		if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
			// no internet connection => try again
			setTimeout(main, 1000);
		} else {
			// console.error(error);
			console.log("😭 Couldn't load weather. Did you set the API key?");
		}
	}
})();

/**
 * geocode a search query
 *
 * @param {string} searchQuery - a phrase to search for (address, POI, ...)
 *
 * @returns {Promise<object>} - location as object: { name, lat, lng }
 */
async function geocode(searchQuery) {
	try {
		const params = querystring.stringify({
			address: searchQuery,
		});

		const geocode = await (await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)).json();

		// check for errors
		if (geocode.status !== 'OK') {
			console.error(`Error: Could not geocode the given address (${geocode.status}).`);
			return null;
		}

		// process results
		const city = geocode.results[0].address_components.find(comp => comp.types.includes('locality')).long_name;
		const country = geocode.results[0].address_components.find(comp => comp.types.includes('country')).long_name;
		const location = {
			name: `${city}, ${country}`,
			lat: geocode.results[0].geometry.location.lat,
			lng: geocode.results[0].geometry.location.lng,
		};

		return location;
	} catch (err) {
		console.error(err);
		return null;
	}
}
