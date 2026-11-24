const STATUS_POR_CODIGO = {
  VALIDACION: 400,
  EMAIL_DUPLICADO: 400,
  CREDENCIALES_INVALIDAS: 401
};

// Traduce los errores de negocio (err.codigo) a respuestas HTTP.
// Una ruta puede fijar sus propios mensajes en res.locals.mensajesError,
// por codigo o con la clave INTERNO para el 500.
module.exports = function manejadorErrores(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = STATUS_POR_CODIGO[err.codigo] ?? 500;
  const mensajesRuta = res.locals.mensajesError ?? {};

  if (status === 500) {
    console.error('Error no controlado:', err);
    return res.status(500).json({ error: mensajesRuta.INTERNO ?? 'Error en el servidor' });
  }

  res.status(status).json({ error: mensajesRuta[err.codigo] ?? err.message });
};
