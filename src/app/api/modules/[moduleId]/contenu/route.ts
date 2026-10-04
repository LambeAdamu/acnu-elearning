import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request, { params }: { params: { moduleId: string } }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session || (role !== "ADMIN" && role !== "FORMATEUR")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as "video" | "audio" | "texte" | "certificat";
  if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: type === "video" ? "video" : type === "certificat" ? "raw" : "auto",
        folder: type === "certificat" ? "acnu/certificats-templates" : "acnu/modules",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    uploadStream.end(buffer);
  });

  const field =
    type === "video" ? "contenuVideo" :
    type === "audio" ? "contenuAudio" :
    type === "certificat" ? "certificatTemplateUrl" : "contenuTexte";

  const module = await prisma.module.update({ where: { id: params.moduleId }, data: { [field]: result.secure_url } });
  return NextResponse.json({ url: result.secure_url, module });
}
