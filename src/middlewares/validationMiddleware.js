// Valida los campos obligatorios del registro
export const validateRegister = (req, res, next) => {
  const { nombre_usuario, nombre_completo, email, password } = req.body;

  if (!nombre_usuario || !nombre_completo || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  next();
};

// Valida login
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  next();
};

// Valida creación de publicaciones
export const validatePost = (req, res, next) => {
  const { url_imagen } = req.body;

  if (!url_imagen) {
    return res.status(400).json({ error: 'La URL de la imagen es obligatoria' });
  }

  next();
};