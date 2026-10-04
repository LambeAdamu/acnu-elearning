import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import VideoPlayer from "@/components/ui/VideoPlayer";
import AudioPlayer from "@/components/ui/AudioPlayer";
import TextReader from "@/components/ui/TextReader";
import Link from "next/link";

export default async function CoursModule({ params }: { params: { moduleId: string } }) {
  const session = await auth();
  if (!session) return <div className="p-6">Non authentifié</div>;
  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const module = await prisma.module.findUnique({ where: { id: params.moduleId }, include: { examens: true } });
  if (!module) return <div className="p-6">Module introuvable</div>;
  if (module.category !== user?.category) {
    return <div className="p-6">Ce module n'appartient pas à votre cursus.</div>;
  }

  const modulesPrecedents = await prisma.module.findMany({
    where: { category: module.category, ordre: { lt: module.ordre } },
    orderBy: { ordre: "asc" },
  });

  let unlocked = true;
  for (const prev of modulesPrecedents) {
    const prog = await prisma.progression.findUnique({ where: { userId_moduleId: { userId, moduleId: prev.id } } });
    if (!prog?.estTermine) { unlocked = false; break; }
  }

  if (!unlocked) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="card p-6 border-l-4 border-red-400 text-red-600">
          Ce module est verrouillé. Validez les modules précédents pour y accéder.
        </div>
      </div>
    );
  }

  const examen = module.examens[0];
  const progression = await prisma.progression.findUnique({ where: { userId_moduleId: { userId, moduleId: module.id } } });
  const dejaValide = progression?.estTermine || false;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2 text-slate-800">{module.titre}</h1>
      <p className="text-gray-600 mb-6">{module.description}</p>

      <div className="space-y-6">
        {module.contenuVideo && <VideoPlayer src={module.contenuVideo} />}
        {module.contenuAudio && <AudioPlayer src={module.contenuAudio} />}
        {module.contenuTexte && <TextReader content={module.contenuTexte} />}
        {!module.contenuVideo && !module.contenuAudio && !module.contenuTexte && (
          <p className="text-slate-400 text-sm">Aucun contenu disponible pour ce module.</p>
        )}
      </div>

      {!dejaValide && examen && (
        <div className="mt-8 text-center">
          <Link href={`/apprenant/examen/${module.id}`} className="btn-primary">Passer l'examen</Link>
        </div>
      )}
      {dejaValide && <div className="mt-8 text-center text-green-600 font-medium">Module validé avec {progression?.note}%</div>}
    </div>
  );
}
