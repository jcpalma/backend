import { connect } from 'mongoose';

export async function dbInit() {
    try {
        await connect('mongodb://localhost:27017/hospital-db', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
    } catch (err) {
        console.error('Error al iniciar la base de datos', err);
        process.exit(1);
    }
    console.log('Database %s was start!', 'hospital-db');
}