export function ContentBoxBig({ content1, content2 }) {
  return (
    <div className="text-container">
      <div className="row align-items-center">
        <div className="col-8 text-start">{content1}</div>
        <div class="col-4 text-center">{content2}</div>
      </div>
    </div>
  );
}

export function ContentBoxMedium({ content1, content2, icon }) {
  return (<div className="text-container">
    <div className="row align-items-center">
      <div className="col-8 text-start">{content1}</div>
      <div class="col-4 text-end">{icon}</div>
    </div>
    <div className="row align-items-center text-start">
      <div className="col-12">{content2}</div>
    </div>
  </div>);
}
