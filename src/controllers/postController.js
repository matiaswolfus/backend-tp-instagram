import { getAllPosts, createPost } from '../services/postService.js';

export const getFeed = async (req, res) => {
  try {
    const posts = await getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createPublication = async (req, res) => {
  try {
    const { id } = req.user; // el usuario_id sale del token, no del body
    const { url_imagen, descripcion } = req.body;

    const newPost = await createPost(id, url_imagen, descripcion);

    return res.status(201).json({
      message: 'Publicación creada con éxito',
      post: newPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};