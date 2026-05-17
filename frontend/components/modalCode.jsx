import { useCodeForm } from "../hooks/useCodeForm.js";
import { Icon } from "./icons.jsx";

export default function CodeModal({ isOpen, onClose, onSuccess }) {
  const { code, error, handleChange, handleSubmit, reset } = useCodeForm(onSuccess);

  if (!isOpen) return null;

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <div className="code-modal-overlay" onClick={handleClose}>
      <div className="code-modal" onClick={(e) => e.stopPropagation()}>
        <button className="code-modal-close" type="button" onClick={handleClose}>
          <Icon className="code-modal-close-icon" name="close" />
        </button>
        <h3>Enter Code</h3>
        <form onSubmit={handleSubmit}>
          <input
            className="code-modal-input"
            type="text"
            inputMode="numeric"
            value={code}
            onChange={handleChange}
            placeholder="Room code"
            autoFocus
          />
          {error && <div className="error code-modal-error">{error}</div>}
          <button type="submit" className="code-modal-submit">Join</button>
        </form>
      </div>
    </div>
  );
}