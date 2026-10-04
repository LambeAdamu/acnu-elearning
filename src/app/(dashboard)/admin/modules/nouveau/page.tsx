import ModuleForm from "@/components/forms/ModuleForm";

export default function NouveauModulePage({ searchParams }: { searchParams: { cursus?: string } }) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Nouveau module</h1>
      <ModuleForm defaultCategory={searchParams.cursus} />
    </div>
  );
}
