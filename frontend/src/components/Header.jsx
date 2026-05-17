// Header.jsx

import React from 'react'

function Header({ title, onNew }) {

  return (
    <div className="page-header">

      <div>
        <h1>{title}</h1>

        <p className="page-subtitle">
          Gestión del taller
        </p>
      </div>

      <button className="btn-primary" onClick={onNew}>
        + Nuevo
      </button>

    </div>
  )
}

export default Header