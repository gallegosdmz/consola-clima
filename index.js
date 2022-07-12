require('dotenv').config();

const _ = require('lodash');

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {

    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await inquirerMenu();

        switch (opt) {

            case 1: 
                // Mostrar mensaje
                const lugar = await leerInput('Ciudad: ');

                // Buscar los lugares
                const lugares = await busquedas.ciudad(lugar);

                // Seleccionar el lugar
                const id = await listarLugares(lugares);

                if (id === '0') continue;

                const lugarSel = lugares.find(l => l.id === id);

                // Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                // Clima
                const clima = await busquedas.temperatura(lugarSel.lat, lugarSel.lng);
                const cdesc = clima.desc;

                const desc = _.capitalize(cdesc);

                // Mostrar resultados
                console.log('\n Información de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como está el clima:', desc.green);
            break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;

                    console.log(`${idx} ${lugar}`);
                });
            break;
        }

        if (opt !== 0) await pausa();

    }while(opt !== 0)

    console.clear();
}

main();