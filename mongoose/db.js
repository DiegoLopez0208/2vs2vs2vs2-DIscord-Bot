/* eslint-disable no-undef */
import mongoose from "mongoose";
import "../config/dotenv.js";

mongoose.connect(process.env.DATABASE_TOKEN);

const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(console, "[❌] Error de conexión con MongoDBs ")
);
db.once("open", () => {
  console.log("[✅] Conexion con la base de datos de MongoDB con exito ");
});

export { db as dataBase };
