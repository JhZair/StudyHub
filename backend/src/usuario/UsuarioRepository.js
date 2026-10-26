const IUsuarioRepository = require('./model/IUsuarioRepository');
const Usuario = require('./model/Usuario');

class UsuarioRepository extends IUsuarioRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async findByEmail(email) {
    const [rows] = await this.db.query('SELECT * FROM usuario WHERE email = ?', [email]);
    return rows.length > 0 ? new Usuario(rows[0]) : null;
  }

  async findById(id) {
    const [rows] = await this.db.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
    return rows.length > 0 ? new Usuario(rows[0]) : null;
  }

  async findAll() {
    const [rows] = await this.db.query('SELECT * FROM usuario');
    return rows.map((row) => new Usuario(row));
  }

  async save(usuario) {
    try {
      const [result] = await this.db.query(
        'INSERT INTO usuario (nombre, email, password, universidad, fecha_registro, ultimo_acceso) VALUES (?, ?, ?, ?, ?, ?)',
        [usuario.nombre, usuario.email, usuario.password, usuario.universidad, usuario.fecha_registro, usuario.ultimo_acceso]
      );
      return new Usuario({ ...usuario, id_usuario: result.insertId });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw Object.assign(new Error('Correo ya registrado'), { codigo: 'EMAIL_DUPLICADO' });
      }
      throw err;
    }
  }
}

module.exports = UsuarioRepository;
