const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    req.db.query('SELECT * FROM usuario WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err });

        if (results.length === 0) {
            return res.status(401).json({ message: 'Email not found' });
        }

        const user = results[0];

        // Check if password matches
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Create JWT token
        const token = jwt.sign({ id_usuario: user.id_usuario, email: user.email }, 'your_secret_key', {
            expiresIn: '2h' // Token expiration time
        });

        res.json({ message: 'Login successful', token });
    });
});

module.exports = router;
