function Modal({ open, title, text, onConfirm, onCancel }) {

  if (!open) return null

  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <h3>{title}</h3>

        <p>{text}</p>

        <div className="modal-actions">

          <button
            className="btn-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="btn-primary"
            onClick={onConfirm}
          >
            Confirmar
          </button>

        </div>

      </div>

    </div>
  )
}

export default Modal