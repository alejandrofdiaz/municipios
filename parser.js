const path = require('path');
const fs = require('fs');
const xmlToJS = require('xml-js').xml2js;

const xmlFolder = path.resolve(__dirname, 'xml');
const jsonFolder = path.resolve(__dirname, 'json');

fs.readdir(xmlFolder, (err, files) => {
	files.forEach(item => {
		fs.readFile(`${xmlFolder}/${item}`, 'utf8', (err, body) => {
			fs.writeFile(
				`${jsonFolder}/${item.replace('.xml', '')}.json`,
				JSON.stringify(xmlHelper(body)),
				(err) => {
					console.log(`The file ${item.replace('.xml', '')}.json was saved!`);
				})
		})
	})
})

class MunicipiosJSON {
	constructor() {
		this.nm = ''; //DENOMINACIÓN DEL MUNICIPIO SEGÚN M. DE HACIENDA Y ADMINISTRACIONES PÚBLICAS
		this.locat = { //CÓDIGOS DEL MUNICIPIO SEGÚN MHAP
			cd: '', //CÓDIGO DE LA DELEGACIÓN MHAP
			cmc: '' //CÓDIGO DEL MUNICIPIO
		}
		this.loine = { //CÓDIGOS DEL MUNICIPIO SEGÚN INE
			cp: '', //CÓDIGO DE LA PROVINCIA
			cm: '' //CÓDIGO DEL MUNICIPIO
		}
	}
}

const xmlHelper = body =>
	xmlToJS(body)
		.elements[0].elements
		.find(el => el.name === 'municipiero').elements
		.filter(el => el.name === 'muni')
		.map(_el => {
			let simplifiedElement = new MunicipiosJSON();
			simplifiedElement.nm =
				_el.elements
					.find(el => el.name === 'nm').elements[0].text;
			simplifiedElement.locat.cd =
				_el.elements
					.find(el => el.name === 'locat').elements
					.find(el => el.name === 'cd').elements[0].text;
			simplifiedElement.locat.cmc =
				_el.elements
					.find(el => el.name === 'locat').elements
					.find(el => el.name === 'cmc').elements[0].text;
			simplifiedElement.loine.cp =
				_el.elements
					.find(el => el.name === 'loine').elements
					.find(el => el.name === 'cp').elements[0].text;
			simplifiedElement.loine.cm =
				_el.elements
					.find(el => el.name === 'loine').elements
					.find(el => el.name === 'cm').elements[0].text;
			return simplifiedElement
		})
