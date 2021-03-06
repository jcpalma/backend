import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
    name: string;
    img: string;
    user: string;
    hospital: string;
};

const DoctorSchema: Schema = new Schema({
    name: { type: String, required: [true, 'El nombre del doctor es requerido'] },
    img: String,
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id del hospital es un campo obligatorio'] }
}, { collection: 'doctors' });

export default mongoose.model<IDoctor>('Doctor', DoctorSchema, 'doctors');