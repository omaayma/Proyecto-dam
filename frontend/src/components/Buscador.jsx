import React from 'react'

function Buscador({ value, onChange }) {
  return (
    <input
      type="text"
      className="buscador-input"
      placeholder="Buscar..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default Buscador