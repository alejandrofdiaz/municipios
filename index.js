const path = require('path');
const request = require('request');
const provincias = require('./provincias');
const fs = require('fs');
const URL_BASE_CATASTRO = 'http://ovc.catastro.meh.es/ovcservweb/ovcswlocalizacionrc/';

const writeMunicipios = provincia => {
	const [service, action] = ['ovccallejero.asmx', 'ConsultaMunicipio']
	const options = {
		url: `${URL_BASE_CATASTRO}${service}/${action}`,
		method: 'GET',
		qs: {
			Provincia: provincia, Municipio: ''
		},
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
		}
	}

	return new Promise((resolve, reject) => {
		request
			.get(options, (err, httpResponse, body) => {
				resolve(body);
			})
	})
}

let index = 0;
const arrayLength = provincias.length;
const offset = 15000; //15s;
const initApp = () => {
	const item = provincias[index];
	if (index < arrayLength) {
		setTimeout(() => {
			writeMunicipios(item.label).then(body => {
				index++;
				fs.writeFile(`${path.resolve(__dirname, 'xml')}/${item.value}${item.label}.xml`,
					body,
					function (err) {
						if (err) {
							return console.log(err);
						} else {
							initApp();
							console.log(`The file ${item.value}${item.label}.xml was saved!`);
						}
					});
			})
		}, offset);
	}
}

initApp();