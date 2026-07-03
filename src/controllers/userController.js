import { getUserProfile, updateUserProfile } from '../services/userService.js';

export const getProfile = async (req, res) => {
  try {
    const { id } = req.user; // viene del token decodificado

    const profile = await getUserProfile(id);
    if (!profile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si no tiene posts, json_agg devuelve [null], lo limpiamos
    if (profile.publicaciones[0] === null) {
      profile.publicaciones = [];
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { nombre_completo, biografia, foto_perfil } = req.body;

    const updatedUser = await updateUserProfile(id, nombre_completo, biografia, foto_perfil);

    return res.status(200).json({
      message: 'Perfil actualizado con éxito',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};