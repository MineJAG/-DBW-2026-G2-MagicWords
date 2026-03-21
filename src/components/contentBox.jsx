export function ContentBoxBig({content1, content2}) {
  return (
    <div className="row justify-content-center">
      <div className="text-container">
        <div className="row align-items-center">
          <div className="col-8 text-start">
            {content1}
          </div>
          <div class="col-4 text-center">
            {content2}
          </div>
        </div>
      </div>
    </div>
  );
}

