import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  findUserByUsername,
  createUser,
} from '../services/authService.js';

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { nombre_usuario, nombre_completo, email, password } = req.body;

    // Chequea duplicados
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const existingUsername = await findUserByUsername(nombre_usuario);
    if (existingUsername) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Encripta la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createUser(nombre_usuario, nombre_completo, email, hashedPassword);

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Genera el token con datos mínimos necesarios (sin password)
    const token = jwt.sign(
      { id: user.id, nombre_usuario: user.nombre_usuario, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};