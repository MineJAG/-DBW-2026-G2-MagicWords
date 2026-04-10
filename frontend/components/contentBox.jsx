export function ContentBoxBig({ content1, content2, size }) {
  return (
    <div className={`text-container ${size || 'text-container-big-size'}`}>
      <div className="row align-items-center">
        <div className="col-8 text-start">{content1}</div>
        <div className="col-4 text-center">{content2}</div>
      </div>
    </div>
  );
}

export function ContentBoxMedium({ content1, content2, icon }) {
  return (<div className="text-container text-container-medium-size p-4 m-5">
    <div className="row align-items-center">
      <div className="col-8 text-start">{content1}</div>
      <div className="col-4 text-end">{icon}</div>
    </div>
    <div className="row align-items-center text-start">
      <div className="col-12">{content2}</div>
    </div>
  </div>);
}

export function ContentBoxSmall({ content1 }) {
  return (
    <div className="text-container">
      <div className="align-items-center">
        <div className="text-start">{content1}</div>
      </div>
    </div>
  );
}