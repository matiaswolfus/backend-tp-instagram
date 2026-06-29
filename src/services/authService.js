import pool from '../configs/db.js';

// Busca un usuario en la BD por su email. Lo usamos para verificar si ya existe al registrarse o para el login
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0]; // devuelve el usuario o undefined si no existe
};

// Lo mismo pero por nombre de usuario, para verificar que no haya duplicados al registrarse
export const findUserByUsername = async (nombre_usuario) => {
  const result = await pool.query(
    'SELECT * FROM usuarios WHERE nombre_usuario = $1',
    [nombre_usuario]
  );
  return result.rows[0];
};

// Inserta un usuario nuevo en la tabla. La password ya llega encriptada desde el controller
export const createUser = async (nombre_usuario, nombre_completo, email, hashedPassword) => {
  const result = await pool.query(
    `INSERT INTO usuarios (nombre_usuario, nombre_completo, email, password)
     VALUES ($1, $2, $3, $4) RETURNING id, nombre_usuario, email`,
    [nombre_usuario, nombre_completo, email, hashedPassword]
  );
  return result.rows[0]; // devuelve el usuario creado (sin la password)
};