'use strict';

const fs = require('fs');
const Papa = require('papaparse');

const countriesData = fs.readFileSync('countries.tsv', "utf8");
const citiesData = fs.readFileSync('cities15000.tsv', "utf8");

Papa.parse(countriesData, {
  delimiter: "\t",
  complete: ({ data: countries }) => 
    Papa.parse(citiesData, {
      delimiter: "\t",
      complete: ({ data: cities }) => {
        //console.log(cities);
        let mapping = {};
        countries.forEach(country => {
          const countryCode = country[0];
          if (!countryCode)
            return;
          const countryName = country[4];
          let countryCities = [];
          cities.forEach(city => {
            if (city[8] === countryCode)
              countryCities.push(city[1]);
          });
          countryCities.sort((a,b) => (a > b) ? 1 : -1);
          if (countryCities.length > 0) {
            mapping[countryName] = [];
            countryCities.forEach(countryCity => {
              if (mapping[countryName].includes(countryCity))
                ;
              else
                mapping[countryName].push(countryCity);
            });
          }
        });
        console.log(mapping)
        fs.writeFileSync('mapping.json', JSON.stringify(mapping), 'utf8');
      }
    })
});

