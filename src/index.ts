import app from './app';
import { dbInit } from './db/database';


async function main() {

    // * Inicia la conexión a la base de datos.
    await dbInit();

    // * Inicia el servidor express
    await app.listen(app.get('port'));
    console.log('Server on port', app.get('port'));
}

main();