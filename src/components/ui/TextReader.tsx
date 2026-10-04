export default function TextReader({ content }: { content: string }) {
  return (
    <div
      className="card p-6 prose prose-slate max-w-none border-l-4"
      style={{ borderLeftColor: "var(--acnu-accent)" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <p className="text-sm font-medium mb-3" style={{ color: "var(--acnu-dark)" }}>Support de cours</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
