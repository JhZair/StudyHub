const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // Configura tus credenciales correctamente
});

console.log("authRoutes.js cargado correctamente");

// Ruta para verificar el token
router.post("/verify-token", async (req, res) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Token válido:", decodedToken);
    res.status(200).send({ message: "Token válido", decodedToken });
  } catch (error) {
    console.error("Error al verificar el token:", error);
    res.status(401).send({ error: "Token inválido" });
  }
});

// Exportar el router
module.exports = router;