import pool from '../configs/db.js';

// Trae el perfil completo del usuario logueado: sus datos + todas sus publicaciones en un array
// Usamos LEFT JOIN para que devuelva el perfil aunque el usuario no tenga posts todavía
export const getUserProfile = async (id) => {
  const result = await pool.query(
    `SELECT u.id, u.nombre_usuario, u.nombre_completo, u.email, u.foto_perfil, u.biografia,
            json_agg(p.*) AS publicaciones
     FROM usuarios u
     LEFT JOIN publicaciones p ON p.usuario_id = u.id
     WHERE u.id = $1
     GROUP BY u.id`,
    [id]
  );
  return result.rows[0];
};

// Actualiza los datos editables del perfil: nombre completo, biografía y foto
// El id lo sacamos del token JWT, así el usuario solo puede editar su propio perfil
export const updateUserProfile = async (id, nombre_completo, biografia, foto_perfil) => {
  const result = await pool.query(
    `UPDATE usuarios
     SET nombre_completo = $1, biografia = $2, foto_perfil = $3
     WHERE id = $4
     RETURNING id, nombre_usuario, nombre_completo, biografia, foto_perfil`,
    [nombre_completo, biografia, foto_perfil, id]
  );
  return result.rows[0];
};