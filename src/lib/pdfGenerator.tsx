import { renderToBuffer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet, Svg, Circle, Path } from "@react-pdf/renderer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import cloudinary from "@/lib/cloudinary";
import { genererCodeCertificat } from "@/utils/helpers";
import { getTheme, categoryLabel } from "@/lib/themes";
import { Category } from "@prisma/client";

const styles = StyleSheet.create({
  page: { padding: 46, backgroundColor: "#FFFFFF" },
  bandeau: { height: 10, marginBottom: 26 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 16 },
  subtitle: { fontSize: 13, textAlign: "center", marginBottom: 8, color: "#475569" },
  nom: { fontSize: 22, textAlign: "center", marginVertical: 18, fontWeight: 700 },
  category: { fontSize: 12, textAlign: "center", marginBottom: 14, color: "#475569" },
  content: { fontSize: 12, marginBottom: 6, textAlign: "center", color: "#334155" },
  moduleTitre: { fontSize: 17, textAlign: "center", marginVertical: 8 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 50, paddingHorizontal: 20 },
  signatureBlock: { alignItems: "center" },
  signatureLine: { fontSize: 10, color: "#334155", marginTop: 30 },
  code: { fontSize: 9, textAlign: "center", marginTop: 24, color: "#94a3b8" },
});

function CertificatPDF({
  nom,
  moduleTitre,
  category,
  note,
  date,
  code,
}: {
  nom: string;
  moduleTitre: string;
  category: Category;
  note: number;
  date: Date;
  code: string;
}) {
  const theme = getTheme(category);

  return (
    <Document>
      <Page style={styles.page}>
        <View style={[styles.bandeau, { backgroundColor: theme.primary }]} />

        {/* Cachet ACNU stylisé (cercle + étoile simplifiée) */}
        <View style={{ alignItems: "center", marginBottom: 6 }}>
          <Svg width={60} height={60} viewBox="0 0 60 60">
            <Circle cx={30} cy={30} r={27} stroke={theme.primary} strokeWidth={2} fill="none" />
            <Circle cx={30} cy={30} r={6} fill={theme.accent} />
          </Svg>
          <Text style={{ fontSize: 9, color: theme.primary, marginTop: 2, fontWeight: 700 }}>ACNU</Text>
        </View>

        <Text style={[styles.title, { color: theme.dark }]}>Attestation de réussite</Text>
        <Text style={styles.subtitle}>Ce certificat est délivré à</Text>
        <Text style={[styles.nom, { color: theme.primary }]}>{nom}</Text>
        <Text style={styles.category}>Cursus : {categoryLabel(category)}</Text>
        <Text style={styles.content}>Pour avoir validé le module :</Text>
        <Text style={[styles.moduleTitre, { color: theme.dark }]}>{moduleTitre}</Text>
        <Text style={styles.content}>
          Avec une note de {note}% le {date.toLocaleDateString("fr-FR")}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLine}>___________________</Text>
            <Text style={{ fontSize: 9, color: "#334155" }}>Direction ACNU-Learning</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLine}>___________________</Text>
            <Text style={{ fontSize: 9, color: "#334155" }}>Cachet ACNU</Text>
          </View>
        </View>

        <Text style={styles.code}>Code de vérification : {code}</Text>
      </Page>
    </Document>
  );
}

/**
 * Génère un certificat entièrement automatique (logo/signature/cachet ACNU)
 * lorsque le module n'a pas de modèle PDF pré-signé rattaché.
 */
export async function genererCertificat(
  user: { id: string; name: string | null },
  module: { id: string; titre: string },
  category: Category,
  note: number
): Promise<{ url: string; code: string }> {
  const code = genererCodeCertificat(category);
  const buffer = await renderToBuffer(
    <CertificatPDF
      nom={user.name || "Apprenant"}
      moduleTitre={module.titre}
      category={category}
      note={note}
      date={new Date()}
      code={code}
    />
  );

  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "acnu/certificats", public_id: `${user.id}-${module.id}-${Date.now()}`, format: "pdf" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    uploadStream.end(buffer);
  });

  return { url: result.secure_url, code };
}

/**
 * Superpose nom / catégorie / code / date sur un modèle PDF pré-signé fourni
 * par l'admin pour ce module (certificatTemplateUrl), via pdf-lib.
 */
export async function genererCertificatDepuisTemplate(
  templateUrl: string,
  user: { id: string; name: string | null },
  module: {
    id: string;
    titre: string;
    certifNomY?: number | null;
    certifCodeY?: number | null;
    certifDateY?: number | null;
  },
  category: Category,
  note: number
): Promise<{ url: string; code: string }> {
  const code = genererCodeCertificat(category);
  const nom = user.name || "Apprenant";
  const dateStr = new Date().toLocaleDateString("fr-FR");
  const theme = getTheme(category);

  const templateBytes = await fetch(templateUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const { width } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSmall = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const hex = theme.primary.replace("#", "");
  const couleur = rgb(
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
  );
  const gris = rgb(0.2, 0.2, 0.2);

  function drawCentered(text: string, y: number, size: number, useFont = font, color = gris) {
    const textWidth = useFont.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - textWidth) / 2, y, size, font: useFont, color });
  }

  drawCentered(nom, module.certifNomY ?? 420, 22, font, couleur);
  drawCentered(`Code de vérification : ${code}`, module.certifCodeY ?? 120, 10, fontSmall);
  drawCentered(
    `Délivré le ${dateStr} — ${module.titre} — Note : ${note}%`,
    module.certifDateY ?? 160,
    11,
    fontSmall
  );

  const pdfBytes = await pdfDoc.save();

  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "acnu/certificats", public_id: `${user.id}-${module.id}-${Date.now()}`, format: "pdf" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    uploadStream.end(Buffer.from(pdfBytes));
  });

  return { url: result.secure_url, code };
}
