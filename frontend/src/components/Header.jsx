function Header({ title, onNew }) {

  return (
    <div className="page-header">

      <h1>{title}</h1>

      {onNew && (
        <button className="btn-primary" onClick={onNew}>
          + Nuevo
        </button>
      )}

    </div>
  )
}

export default Header