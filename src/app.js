import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import fileUpload from 'express-fileupload';
import indexRoutes from "./routes/index.routes.js";
import generalRoutes from "./routes/general.routes.js";

const app = express();

const corsOptions = 
{
  origin:"*",
  optionsSuccessStatus : 200,
}

app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads'
}))

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", indexRoutes);
app.use("/api/v1/emapta", generalRoutes);

export default app;
