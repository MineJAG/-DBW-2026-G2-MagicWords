export function BigDisplay({ text }) {
  return <h1 className="display-1">{text}</h1>;
}

export function SmallDisplay({ text }) {
  return (
    <div className="row m-4 text-center">
      <h3>{text}</h3>
    </div>
  );
}
