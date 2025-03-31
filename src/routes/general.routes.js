import { Router } from "express";
import { createEHRMapping, deleteEHRMapping, getAllEHRMappings, getEHRMappingById, signinHandler, signupHandler, updateEHRMapping } from "../controllers/general.controller.js";
import { checkExistingRole, checkExistingUser } from "../middlewares/verifySignup.js";
import { verifyTokenMiddleware } from "../middlewares/authJwt.js";

const router = Router();

// Auth
router.post("/signup", [checkExistingUser, checkExistingRole], signupHandler);
router.post("/signin", signinHandler);

// EHR Routes
router.post("/ehr", verifyTokenMiddleware(["user"], ["POST"]), createEHRMapping);
router.get("/ehr", verifyTokenMiddleware(["user"], ["GET"]), getAllEHRMappings);
router.get("/ehr/:id", verifyTokenMiddleware(["user"], ["GET"]), getEHRMappingById);
router.put("/ehr/:id", verifyTokenMiddleware(["user"], ["PUT"]), updateEHRMapping);
router.delete("/ehr/:id", verifyTokenMiddleware(["user"], ["DELETE"]), deleteEHRMapping);


export default router;
