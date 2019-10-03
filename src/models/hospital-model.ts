import mongoose, { Schema, Document } from 'mongoose';

export interface IHospital extends Document {
    name: string;
    img: string;
    user: string;
};

const HospitalSchema: Schema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    img: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'hospitals' });


export default mongoose.model<IHospital>('Hospital', HospitalSchema, 'hospitals');