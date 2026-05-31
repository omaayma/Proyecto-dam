import React, { useState } from 'react'

function Mensajes() {
  const [mensajes,     setMensajes]     = useState(() => JSON.parse(localStorage.getItem('mensajes_admin') || '[]'))
  const [seleccionado, setSeleccionado] = useState(null)

  const marcarLeido = (id) => {
    const nuevos = mensajes.map(m => m.id === id ? { ...m, leido: true } : m)
    setMensajes(nuevos)
    localStorage.setItem('mensajes_admin', JSON.stringify(nuevos))
  }

  const eliminarMensaje = (id) => {
    const nuevos = mensajes.filter(m => m.id !== id)
    setMensajes(nuevos)
    localStorage.setItem('mensajes_admin', JSON.stringify(nuevos))
    if (seleccionado?.id === id) setSeleccionado(null)
  }

  const abrirMensaje = (m) => {
    setSeleccionado(m)
    marcarLeido(m.id)
  }

  return (
    <div className="mensajes-wrapper">
      <h1 className="dashboard-welcome">✉️ Mensajes</h1>
      <div className="mensajes-layout">
        <div className="mensajes-lista">
          {mensajes.length === 0 && <p className="empty-text">No hay mensajes.</p>}
          {mensajes.map(m => (
            <div
              key={m.id}
              className={`mensaje-item ${!m.leido ? 'no-leido' : ''} ${seleccionado?.id === m.id ? 'activo' : ''}`}
              onClick={() => abrirMensaje(m)}
            >
              <div className="mensaje-item-header">
                <span className="mensaje-de">{m.tipo === 'stock' ? '⚠️ Sistema' : `👤 ${m.de}`}</span>
                <span className="mensaje-fecha">&nbsp;&nbsp;{m.fecha}</span>
              </div>
              <div className="mensaje-asunto">{m.asunto}</div>
              {!m.leido && <span className="badge-nuevo">Nuevo</span>}
            </div>
          ))}
        </div>
        <div className="mensajes-detalle">
          {!seleccionado ? (
            <p className="empty-text">Selecciona un mensaje para leerlo.</p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ marginBottom: '8px' }}>{seleccionado.asunto}</h2>
                  <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
                    {seleccionado.tipo === 'stock' ? '⚠️ Alerta del sistema' : `De: ${seleccionado.de}`}
                    <span style={{ margin: '0 8px' }}>·</span>
                    {seleccionado.fecha}
                  </p>
                </div>
                <button className="btn-del" onClick={() => eliminarMensaje(seleccionado.id)}>🗑️ Eliminar</button>
              </div>
              <div className="mensaje-cuerpo">{seleccionado.texto}</div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Mensajes