import mongo from 'mongoose';

export async function dbInit() {
    mongo.set('useFindAndModify', false);
    mongo.set('useCreateIndex', true);
    try {
        await mongo.connect('mongodb://localhost:27017/hospital-db', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        });
        // Muestra información de las versiones tanto de MongoDB como de Mongoose.
        let { version } = await mongo.connection.db.admin().serverInfo();
        console.log(`mongodb: ${version}`);
        console.log(`mongoose: ${mongo.version}`);
    } catch (err) {
        process.exit(1);
    }
    console.log('Database %s was start!', 'hospital-db');
}

export default mongo;