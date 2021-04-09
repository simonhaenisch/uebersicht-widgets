#!/usr/bin/env node

const { join } = require('path');
const request = require('request-promise-native');
const querystring = require('querystring');
const moment = require('moment');

require('dotenv').config({ path: join(__dirname, '.env') });

// config
const server = 'https://api.darksky.net';
const endpoint = '/forecast';
const apikey = process.env.DARKSKY_KEY;
const units = 'si'; // or 'us' for Fahrenheit

const jsonRequest = async (uri, options) => await request(uri, { json: true, ...options });

async function main({ argv }) {
	// get location object from cli argument (JSON string), or default to Berlin
	const location = argv[2] ? JSON.parse(argv[2]) : { name: 'Berlin, Germany', lat: 52.5069704, lng: 13.28465 };

	// get weather info from darksky for given location
	const weather = await jsonRequest(
		`${server}${endpoint}/${apikey}/${location.lat},${location.lng}?units=${units}&exclude=minutely,hourly,alerts`,
	);

	// find data for today and tomorrow
	let today = weather.daily.data.find((data) => moment.unix(data.time).isSame(moment(), 'day'));
	let tomorrow = weather.daily.data.find((data) => moment.unix(data.time).isSame(moment().add(1, 'days'), 'day'));

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

	return 0;
}

main(process)
	.then(process.exit)
	.catch((err) => {
		if (err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
			// no internet connection => try again
			setTimeout(() => main(process), 5000);
		} else {
			// console.error(err);
			console.log("😭 Couldn't load weather. Did you set the API key?");
		}
	});

/**
 * geocode a search query
 *
 * @param {string} searchQuery a phrase to search for (address, POI, ...)
 *
 * @returns {Promise<object>} location as object: { name, lat, lng } (or null if it fails)
 */
async function geocode(searchQuery) {
	const params = querystring.stringify({
		address: searchQuery,
	});

	const geoCode = await jsonRequest(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);

	// check for errors
	if (geoCode.status !== 'OK') {
		console.error(`Error: Could not geocode the given address (${geoCode.status}).`);
		return null;
	}

	// process results
	const city = geoCode.results[0].address_components.find((comp) => comp.types.includes('locality')).long_name;
	const country = geoCode.results[0].address_components.find((comp) => comp.types.includes('country')).long_name;

	const location = {
		name: `${city}, ${country}`,
		lat: geoCode.results[0].geometry.location.lat,
		lng: geoCode.results[0].geometry.location.lng,
	};

	return location;
}
