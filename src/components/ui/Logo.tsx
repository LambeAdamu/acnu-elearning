/**
 * Logo ACNU. Ceci est un logo vectoriel (SVG) générique — inspiré d'un
 * globe surmonté d'une étoile, dans l'esprit protocolaire ONU. Pour votre
 * vrai logo designé, déposez le fichier dans /public/images/logo-acnu.png
 * et remplacez le <svg> ci-dessous par :
 *   <Image src="/images/logo-acnu.png" alt="ACNU" width={size} height={size} />
 */
export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="ACNU-Learning">
      <circle cx="50" cy="50" r="48" fill="var(--acnu-accent)" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
      {/* méridiens simplifiés, esprit "globe" protocolaire */}
      <ellipse cx="50" cy="50" rx="22" ry="40" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.7" />
      <ellipse cx="50" cy="50" rx="40" ry="22" fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.7" />
      <line x1="10" y1="50" x2="90" y2="50" stroke="#ffffff" strokeWidth="1.6" opacity="0.7" />
      <text x="50" y="58" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontWeight="700" fontSize="26" fill="#ffffff">
        A
      </text>
    </svg>
  );
}
