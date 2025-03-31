import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import User from "../models/User.js";

export const createToken = (user) => {
  const payload = {
    id: user?._id,
  };

  return jwt.sign(payload, SECRET, {
    expiresIn: 86400,
  });
};

const extractToken = (req) => {
  return req.headers?.authorization?.split(' ')[1] || null;
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

const isTokenExpired = (decoded) => {
  return decoded.exp * 1000 < Date.now();
};

const getUserFromToken = async (userId) => {
  return await User.findById(userId, { password: 0 }).populate('roles');
};

const hasRequiredRoles = (user, requiredRoles) => {
  if (requiredRoles.length === 0) return true;
  const userRoles = user.roles.map((role) => role.name);
  return requiredRoles.some((role) => userRoles.includes(role));
};

const hasRequiredMethod = (req, methods) => {
  if (methods.length === 0) return true;
  let requestMethod = String(req.method).toUpperCase();
  methods = methods.map((method) => String(method).toUpperCase());
  return methods.includes(requestMethod);
};

export const verifyTokenMiddleware =
  (requiredRoles = [], methods = []) =>
  async (req, res, next) => {

    const token = extractToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ error: 'El token es requerido', code: 401 });
    }

    try {
      const decoded = verifyToken(token);
      req.userId = decoded.id;

      if (isTokenExpired(decoded)) {
        return res.status(401).json({ error: 'Token expirado', code: 401 });
      }

      const user = await getUserFromToken(req.userId);
      if (!user) {
        return res.status(401).json({ error: 'Usuario no existe', code: 401 });
      }

      if (!hasRequiredRoles(user, requiredRoles)) {
        return res
          .status(403)
          .json({
            error: 'No tiene permisos para acceder a este recurso',
            code: 403,
          });
      }

      if (!hasRequiredMethod(req, methods)) {
        return res
          .status(403)
          .json({
            error: 'No tiene permisos para acceder a este recurso',
            code: 403,
          });
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado', code: 401 });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token inválido', code: 401 });
      } else {
        console.error(error);
        return res
          .status(500)
          .json({ error: 'Internal server error', code: 500 });
      }
    }
  };
