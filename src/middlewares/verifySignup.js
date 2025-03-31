import User from "../models/User.js";
import { ROLES } from "../models/Role.js";

export const checkExistingUser = async (req, res, next) => {
  try {
    const userFound = await User.findOne({ username: req.body.username });
    if (userFound)
      return res.status(422).json({ error: "The user is already registered", code: 422 });

    const email = await User.findOne({ email: req.body.email });
    if (email)
      return res.status(422).json( {error: "The user is already registered", code: 422 });

    next();
  } catch (error) {
    res.status(400).json({ error: "Bad Request", code: 400 });
  }
};

export const checkExistingRole = (req, res, next) => {
  if (!req?.body?.roles) return res.status(400).json({ error: "Roles required", code: 400 });

  for (let i = 0; i < req.body.roles.length; i++) {
    if (!ROLES.includes(req.body.roles[i])) {
      return res.status(400).json({
        error: `Role ${req.body.roles[i]} does not exist`,
        code: 400
      });
    }
  }

  next();
};
