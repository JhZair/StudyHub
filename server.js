const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./authRoutes");

console.log("authRoutes:", authRoutes); // Depuración

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use("/auth", authRoutes);

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: "localhost", // Cambia esto si tu base de datos está en otro servidor
    user: "root", // Usuario de MySQL
    password: "", // Contraseña de MySQL
    database: "studyhub", // Nombre de tu base de datos
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error("Error al conectar a MySQL:", err);
        return;
    }
    console.log("Conectado a la base de datos MySQL");
});

// Ruta para guardar datos del usuario
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;

    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, password], (err, result) => {
        if (err) {
            console.error("Error al insertar datos:", err);
            res.status(500).send("Error al registrar el usuario");
            return;
        }
        res.status(200).send("Usuario registrado exitosamente");
    });
});

// Ruta para obtener datos de los usuarios
app.get("/users", (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener datos:", err);
            res.status(500).send("Error al obtener usuarios");
            return;
        }
        res.status(200).json(results);
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
console.log("Iniciando servidor...");
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});