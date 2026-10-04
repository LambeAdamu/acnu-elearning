export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isPhoneValid(tel: string): boolean {
  return /^[0-9+\s.-]{8,15}$/.test(tel);
}

export function validateInscriptionForm(data: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  category?: string;
}): string | null {
  if (!data.nom || data.nom.trim().length < 2) return "Le nom est requis.";
  if (!data.prenom || data.prenom.trim().length < 2) return "Le prénom est requis.";
  if (!isEmailValid(data.email)) return "Email invalide.";
  if (!isPhoneValid(data.telephone)) return "Numéro de téléphone invalide.";
  if (!data.category) return "Veuillez choisir une catégorie.";
  return null;
}

export function validateModuleForm(data: { titre: string; ordre: number | string }): string | null {
  if (!data.titre || data.titre.trim().length < 3) return "Le titre doit contenir au moins 3 caractères.";
  if (data.ordre === undefined || Number(data.ordre) < 1) return "L'ordre doit être un nombre positif.";
  return null;
}

export function validateExamenForm(data: { seuilReussite: number; questions: any[] }): string | null {
  if (data.seuilReussite < 0 || data.seuilReussite > 100) return "Le seuil de réussite doit être entre 0 et 100.";
  if (!data.questions || data.questions.length === 0) return "L'examen doit contenir au moins une question.";
  return null;
}
