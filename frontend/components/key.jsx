export default function Key({ letter, active }) {
  return (
    <div className={`kb-key ${active ? "kb-keyactive" : ""}`}>
      {letter}
    </div>
  );
}