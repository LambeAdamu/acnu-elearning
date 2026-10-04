import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "ACNU-Learning <no-reply@acnu-learning.org>";

/**
 * Envoie les identifiants de connexion à un apprenant après validation
 * de son inscription par un administrateur.
 */
export async function envoyerIdentifiants(params: {
  to: string;
  nomComplet: string;
  identifiant: string;
  motDePasse: string;
  categorieLabel: string;
}) {
  const { to, nomComplet, identifiant, motDePasse, categorieLabel } = params;

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Votre accès ACNU-Learning a été validé",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; color:#1f2937;">
        <div style="background:#0B1F3A; padding:20px; text-align:center;">
          <h1 style="color:#fff; margin:0; font-size:20px;">ACNU-LEARNING</h1>
        </div>
        <div style="padding:24px; background:#F4F6F8;">
          <p>Bonjour ${nomComplet},</p>
          <p>Votre inscription au cursus <strong>${categorieLabel}</strong> a été validée par
          notre équipe. Voici vos identifiants de connexion :</p>
          <table style="width:100%; border-collapse:collapse; margin:16px 0;">
            <tr>
              <td style="padding:8px; background:#fff; border:1px solid #e2e8f0;"><b>Identifiant</b></td>
              <td style="padding:8px; background:#fff; border:1px solid #e2e8f0;">${identifiant}</td>
            </tr>
            <tr>
              <td style="padding:8px; background:#fff; border:1px solid #e2e8f0;"><b>Mot de passe temporaire</b></td>
              <td style="padding:8px; background:#fff; border:1px solid #e2e8f0;">${motDePasse}</td>
            </tr>
          </table>
          <p>Pour votre sécurité, il vous sera demandé de <strong>créer votre propre mot de passe</strong>
          dès votre première connexion.</p>
          <p style="margin-top:24px;">L'équipe ACNU-Learning</p>
        </div>
      </div>
    `,
  });
}

/**
 * Envoie un lien de réinitialisation de mot de passe (flux "mot de passe oublié").
 */
export async function envoyerReinitialisation(params: { to: string; nomComplet: string; lien: string }) {
  const { to, nomComplet, lien } = params;
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Réinitialisation de votre mot de passe ACNU-Learning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; color:#1f2937;">
        <div style="background:#0B1F3A; padding:20px; text-align:center;">
          <h1 style="color:#fff; margin:0; font-size:20px;">ACNU-LEARNING</h1>
        </div>
        <div style="padding:24px; background:#F4F6F8;">
          <p>Bonjour ${nomComplet},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien
          ci-dessous pour en choisir un nouveau (valable 1 heure) :</p>
          <p style="text-align:center; margin:24px 0;">
            <a href="${lien}" style="background:#009EDB; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">
              Réinitialiser mon mot de passe
            </a>
          </p>
          <p style="font-size:12px; color:#64748b;">
            Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email — votre
            mot de passe actuel reste inchangé.
          </p>
          <p style="margin-top:24px;">L'équipe ACNU-Learning</p>
        </div>
      </div>
    `,
  });
}
export async function envoyerRefus(params: { to: string; nomComplet: string; motif?: string }) {
  const { to, nomComplet, motif } = params;
  return resend.emails.send({
    from: FROM,
    to,
    subject: "Votre demande d'inscription ACNU-Learning",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin:auto; color:#1f2937;">
        <p>Bonjour ${nomComplet},</p>
        <p>Après examen, votre demande d'inscription à ACNU-Learning n'a pas pu être validée en l'état.
        ${motif ? `<br/>Motif : ${motif}` : ""}</p>
        <p>N'hésitez pas à nous recontacter pour plus d'informations.</p>
        <p>L'équipe ACNU-Learning</p>
      </div>
    `,
  });
}
