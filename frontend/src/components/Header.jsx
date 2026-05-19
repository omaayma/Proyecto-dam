import React from 'react'
 
function Header({ title, onNew, onExport, mostrarCalendario, vistaCalendario, onToggleCalendario }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p className="page-subtitle">Gestión del taller W&O</p>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {mostrarCalendario && (
          <button className="btn-secondary" onClick={onToggleCalendario}>
            {vistaCalendario ? '📋 Ver tabla' : '📅 Ver calendario'}
          </button>
        )}
        {onExport && (
          <button className="btn-secondary" onClick={onExport}>⬇️ Exportar CSV</button>
        )}
        <button className="btn-primary" onClick={onNew}>+ Nuevo</button>
      </div>
    </div>
  )
}
 
export default Header