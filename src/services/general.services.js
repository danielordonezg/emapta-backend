import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

import { SECRET } from "../config.js";
import Role from "../models/Role.js";

export const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+{}|:;'<>,./?])[a-zA-Z0-9~!@#$%^&*()_+{}|:;'<>,./?]{10,}$/;

export const signUp = async (body) => {
  try {
    let error = fieldsValidation(body);
    if (error) return { error: error, code: 422 };
    const { username, email, password } = body;
    const roles = body.roles ?? ["user"];
    const newUser = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
    });

    const foundRoles = await Role
    .find({ name: { $in: roles } });
    newUser.roles = foundRoles.map((role) => role._id);

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, SECRET, {
      expiresIn: 86400,
    });

    const userFound = await User.findOne({ email: email }).populate("roles");

    const data = {
      _id: userFound?._id,
      roles: userFound?.roles?.[0]?.name,
      username: userFound?.username,
      email: userFound?.email,
    };

    return { token, data };
  } catch (error) {
    console.error(error);
    return { error: "Unprocessable Entity", code: 422 };
  }
};

export function fieldsValidation(body) {
  if (!body.username || body.username === "") return "Username es requerido";
  if (!body.username.length > 50)
    return "Nombre de usuario supera el limite de caracteres permitidos";
  if (!body.email || body.email === "") return "Email es requerido";
  if (!validator.validate(body.email)) return "Formato del email es incorrecto";
  if (!body.password || body.password === "") return "Password es requerido";
  if (!regexPassword.test(body.password))
    return "Formato del password es incorrecto debe cumplir los criterios";
  return null;
}

export const signIn = async (body) => {
  try {
    if (!body.email) return { error: "Email es requerido", code: 422 };
    if (!body.password) return { error: "Password es requerido", code: 422 };
    if (!validator.validate(body.email))
      return { error: "Formato del email es incorrecto", code: 422 };

    const userFound = await User.findOne({ email: body.email }).populate(
      "roles"
    );

    if (!userFound) return { error: "Usuario no existe", code: 401 };
    if (!regexPassword.test(body.password))
      return {
        error: "Formato del password es incorrecto debe cumplir los criterios",
        code: 422,
      };

    const passwordIsValid = bcrypt.compareSync(
      body.password,
      userFound.password
    );
    if (!passwordIsValid)
      return res.status(400).send({
        status: "Error",
        message: "Password Invalid",
      });

    const token = jwt.sign({ id: userFound._id }, SECRET, {
      expiresIn: 86400,
    });

    const data = {
      _id: userFound?._id,
      roles: userFound?.roles?.[0]?.name,
      username: userFound?.username,
      email: userFound?.email,
    };

    return { token, data };
  } catch (error) {
    console.error(error);
    return { error: "Internal server error", code: 500 };
  }
};
