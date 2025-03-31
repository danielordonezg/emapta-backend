import mongoose from 'mongoose'
import RoleModel from './Role.js';

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: [true,"El Nombre de usuario es obligatorio"]
    },
    email: {
      type: String,
      unique: true,
      required: [true,"El Email es obligatorio"]
    },
    password: {
      type: String,
      required: [true,"La contraseña es obligatoria"]
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: RoleModel.modelName
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false,
  }
  )
);

export default User;
