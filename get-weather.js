const API_KEY = 'ENTER_YOUR_DARK_SKY_API_KEY_HERE';
const UNITS = 'si'; // or 'us' for Fahrenheit

const querystring = require('querystring');
const fetch = require('node-fetch');
const moment = require('moment');

const location = JSON.parse(process.argv[2] || '{ "lat": 52.5069704, "lng": 13.28465, "name": "Berlin, Germany" }');

(async function main() {
	try {
		// get weather info from darksky for given location
		const weather = await (await fetch(`https://api.darksky.net/forecast/${API_KEY}/${location.lat},${location.lng}?units=${UNITS}&exclude=minutely,hourly,alerts`)).json();

		// find data for today and tomorrow
		let today = weather.daily.data.find(data => moment.unix(data.time).isSame(moment(), 'day'));
		let tomorrow = weather.daily.data.find(data => moment.unix(data.time).isSame(moment().add(1, 'days'), 'day'));

		// console.log(JSON.stringify(weather, null, 2));
		// console.log(JSON.stringify(today, null, 2));
		// console.log(JSON.stringify(tomorrow, null, 2));

		const deg = weather.flags.units === 'si' ? '°C' : '°F';

		const current = {
			temp: Math.round(weather.currently.temperature),
			skyText: weather.currently.summary.toLowerCase(),
			uvi: weather.currently.uvIndex,
		}

		today = {
			min: Math.round(today.temperatureMin),
			max: Math.round(today.temperatureMax),
			forcast: today.summary.toLowerCase().replace('.', ''),
			uvi: today.uvIndex, // max of the day
			uviTime: moment.unix(today.uvIndexTime).format('h A'),
		}

		tomorrow = {
			min: Math.round(tomorrow.temperatureMin),
			max: Math.round(tomorrow.temperatureMax),
			forcast: tomorrow.summary.toLowerCase().replace('.', ''),
		}

		let res = `In ${location.name} it's ${current.temp}${deg} and ${current.skyText} right now.`;

		if (moment().hours() < 21) {
			res += ` Today it will be ${today.forcast} with a forecast high of ${today.max}${deg} and a low of ${today.min}${deg}.`;
		}
		else { // after 9 PM
			res += ` Tomorrow it will be ${tomorrow.forcast} with a forecast high of ${tomorrow.max}${deg} and a low of ${tomorrow.min}${deg}.`;
		}

		// res += `\nThe UV index is currently ${current.uvi} with a maximum of ${today.uvi} around ${today.uviTime}.`;

		console.log(res);
	}
	catch (err) {
		if (err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
			setTimeout(main, 1000);
		}
		else {
			// console.error(err);
			console.log('😭 Couldn\'t load weather. Did you set the API key?');
		}
	}

})();

// function to geocode a search query
async function geocode(searchQuery) {
	const params = querystring.stringify({
		address: searchQuery,
	});

	try {
		const geocode = await (await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)).json();
	}
	catch (err) {
		return console.error(err);
	}

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
}
