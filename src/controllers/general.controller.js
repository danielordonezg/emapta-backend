import EHRMapping from "../models/EHRMapping.js";
import {
  signUp,
  signIn
} from "../services/general.services.js";


// Auth
export const signupHandler = async (req, res) => {
  try {
    if(!req.body) res.status(400).send({error: "El body es obligatorio", code: 400})
    let response = await signUp(req.body);
    if(response?.error) return res.status(response.code).send(response);
    return res.status(201).send(response);
  } catch(error){
    return res.status(500).send({ error: "Internal server error", code: 500});
  };

};

export const signinHandler = async (req, res) => {
  try {
    if(!req.body) res.status(400).send({error: "El body es obligatorio", code: 400});
    let response = await signIn(req.body);
    if (response.error) return res.status(response.code).send(response);
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: "Internal server error", code: 500 });
  }
};

// EHR
export const createEHRMapping = async (req, res) => {
  try {
    const { question, endpoint, ehrSystem } = req.body;

    const mapping = new EHRMapping({ question, endpoint, ehrSystem });
    await mapping.save();

    return res.status(201).json(mapping);
  } catch (error) {
    console.error("Error al crear EHRMapping:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getAllEHRMappings = async (req, res) => {
  try {
    const mappings = await EHRMapping.find();
    return res.status(200).json(mappings);
  } catch (error) {
    console.error("Error al obtener EHRMappings:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getEHRMappingById = async (req, res) => {
  try {
    const mapping = await EHRMapping.findById(req.params.id);
    if (!mapping) {
      return res.status(404).json({ message: "EHRMapping no encontrado" });
    }
    return res.status(200).json(mapping);
  } catch (error) {
    console.error("Error al obtener EHRMapping:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const updateEHRMapping = async (req, res) => {
  try {
    const { question, endpoint, ehrSystem } = req.body;

    const mapping = await EHRMapping.findByIdAndUpdate(
      req.params.id,
      { question, endpoint, ehrSystem },
      { new: true }
    );

    if (!mapping) {
      return res.status(404).json({ message: "EHRMapping no encontrado" });
    }

    return res.status(200).json(mapping);
  } catch (error) {
    console.error("Error al actualizar EHRMapping:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteEHRMapping = async (req, res) => {
  try {
    const mapping = await EHRMapping.findByIdAndDelete(req.params.id);
    if (!mapping) {
      return res.status(404).json({ message: "EHRMapping no encontrado" });
    }
    return res.status(200).json({ message: "EHRMapping eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar EHRMapping:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};