import pool from '../configs/db.js';

// Trae todos los posts de la BD ordenados del más nuevo al más viejo
// Hace JOIN con usuarios para traer también el nombre de usuario y foto de quien publicó
export const getAllPosts = async () => {
  const result = await pool.query(
    `SELECT p.*, u.nombre_usuario, u.foto_perfil
     FROM publicaciones p
     JOIN usuarios u ON u.id = p.usuario_id
     ORDER BY p.fecha_creacion DESC`
  );
  return result.rows;
};

// Crea un nuevo post. El usuario_id lo sacamos del token, no del body,
// así nos aseguramos que nadie pueda publicar en nombre de otro
export const createPost = async (usuario_id, url_imagen, descripcion) => {
  const result = await pool.query(
    `INSERT INTO publicaciones (usuario_id, url_imagen, descripcion)
     VALUES ($1, $2, $3) RETURNING *`,
    [usuario_id, url_imagen, descripcion]
  );
  return result.rows[0];
};