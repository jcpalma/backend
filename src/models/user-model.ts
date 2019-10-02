import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    img: string;
    role: string;
    google: boolean;
}

export const roleList = {
    values: ['ROL_USER', 'ROL_ADMIN'],
    message: '{PATH} no es un rol permitido'
};

const UserSchema: Schema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El correo es requerido'] },
    password: { type: String, required: [true, 'La constraseñ es requerida'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'ROL_USER', enum: roleList }
});

UserSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

// Export the model and return your IUser interface
export default mongoose.model<IUser>('User', UserSchema, 'users');