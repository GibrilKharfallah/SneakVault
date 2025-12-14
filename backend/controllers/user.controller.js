import { User } from '../models/User.model.js';

/** Récupérer le profil du user connecté */
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    res.json(user);
  } catch (err) {
    console.error('Erreur getProfile:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}

/** Mettre à jour le profil */
export async function updateProfile(req, res) {
  try {
    const { firstName, lastName } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName },
      { new: true }
    ).select('-passwordHash');

    if (!updated) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Erreur updateProfile:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}

/** Supprimer le compte */
export async function deleteAccount(req, res) {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Compte supprimé avec succès' });
  } catch (err) {
    console.error('Erreur deleteAccount:', err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}
