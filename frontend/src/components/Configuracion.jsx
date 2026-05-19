import React, { useState } from 'react'

function Configuracion({ tema, onTema, onClose, sesion, authConfig, notify, inline }) {

  const [temaLocal,   setTemaLocal]   = useState(tema)
  const [passForm,    setPassForm]    = useState({ actual: '', nueva: '', repetir: '' })
  const [seccionAbierta, setSeccionAbierta] = useState(null)

  const confirmarTema = () => {
    onTema(temaLocal)
    notify('Tema actualizado correctamente')
    setSeccionAbierta(null)
  }

  const cancelarTema = () => {
    setTemaLocal(tema)
    setSeccionAbierta(null)
  }

  const confirmarContrasena = (e) => {
    e.preventDefault()
    if (passForm.nueva !== passForm.repetir) { notify('Las contraseñas no coinciden', 'err'); return }
    if (passForm.nueva.length < 4)           { notify('Mínimo 4 caracteres', 'err'); return }
    notify('Contraseña actualizada correctamente')
    setPassForm({ actual: '', nueva: '', repetir: '' })
    setSeccionAbierta(null)
  }

  const cancelarContrasena = () => {
    setPassForm({ actual: '', nueva: '', repetir: '' })
    setSeccionAbierta(null)
  }

  const estiloWrapper = inline ? {} : {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  }

  const estiloBox = inline ? { maxWidth: '500px' } : {
    background: 'var(--card)', border: '1px solid var(--line)', borderRadius: '20px',
    padding: '40px', width: '100%', maxWidth: '500px'
  }

  const estiloSeccion = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--line)',
    borderRadius: '14px',
    padding: '20px',
    marginBottom: '16px'
  }

  const estiloTituloSeccion = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  }

  return (
    <div style={estiloWrapper}>
      <div style={estiloBox}>

        {!inline && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px' }}>
            <h2>⚙️ Configuración</h2>
            <button className="btn-del" onClick={onClose}>✕</button>
          </div>
        )}

        {/* Sección Tema */}
        <div style={estiloSeccion}>
          <div style={estiloTituloSeccion} onClick={() => setSeccionAbierta(seccionAbierta === 'tema' ? null : 'tema')}>
            <h3 style={{ margin: 0 }}>🎨 Tema de la aplicación</h3>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{seccionAbierta === 'tema' ? '▲ Cerrar' : '▼ Editar'}</span>
          </div>

          {seccionAbierta === 'tema' && (
            <div style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                <button
                  className={temaLocal === 'dark'  ? 'login-btn' : 'btn-cancel'}
                  style={{ flex: 1 }}
                  onClick={() => setTemaLocal('dark')}
                >
                  🌙 Oscuro
                </button>
                <button
                  className={temaLocal === 'light' ? 'login-btn' : 'btn-cancel'}
                  style={{ flex: 1 }}
                  onClick={() => setTemaLocal('light')}
                >
                  ☀️ Claro
                </button>
              </div>
              <div className="form-actions">
                <button className="login-btn" onClick={confirmarTema}>Confirmar</button>
                <button className="btn-cancel" onClick={cancelarTema}>Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {/* Sección Idioma */}
        <div style={estiloSeccion}>
          <div style={estiloTituloSeccion} onClick={() => setSeccionAbierta(seccionAbierta === 'idioma' ? null : 'idioma')}>
            <h3 style={{ margin: 0 }}>🌐 Idioma</h3>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{seccionAbierta === 'idioma' ? '▲ Cerrar' : '▼ Editar'}</span>
          </div>

          {seccionAbierta === 'idioma' && (
            <div style={{ marginTop: '18px' }}>
              <div className="field">
                <label>Selecciona idioma</label>
                <select defaultValue="es" style={{ width: '100%' }}>
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇬🇧 English</option>
                </select>
              </div>
              <div className="form-actions" style={{ marginTop: '14px' }}>
                <button className="login-btn" onClick={() => { notify('Idioma guardado'); setSeccionAbierta(null) }}>Confirmar</button>
                <button className="btn-cancel" onClick={() => setSeccionAbierta(null)}>Cancelar</button>
              </div>
            </div>
          )}
        </div>

        {/* Sección Cambiar contraseña */}
        <div style={estiloSeccion}>
          <div style={estiloTituloSeccion} onClick={() => setSeccionAbierta(seccionAbierta === 'pass' ? null : 'pass')}>
            <h3 style={{ margin: 0 }}>🔒 Cambiar contraseña</h3>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{seccionAbierta === 'pass' ? '▲ Cerrar' : '▼ Editar'}</span>
          </div>

          {seccionAbierta === 'pass' && (
            <form onSubmit={confirmarContrasena} style={{ marginTop: '18px' }}>
              {[['actual','Contraseña actual'],['nueva','Nueva contraseña'],['repetir','Repetir nueva contraseña']].map(([k,l]) => (
                <div className="field" key={k}>
                  <label>{l}</label>
                  <input
                    type="password"
                    value={passForm[k]}
                    onChange={e => setPassForm(p => ({ ...p, [k]: e.target.value }))}
                    required
                  />
                </div>
              ))}
              <div className="form-actions">
                <button className="login-btn" type="submit">Confirmar</button>
                <button type="button" className="btn-cancel" onClick={cancelarContrasena}>Cancelar</button>
              </div>
            </form>
          )}
        </div>

        <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
            <b>Sesión activa:</b> {sesion?.auth?.email}<br />
            <b>Rol:</b> {sesion?.rol}<br />
            <b>Versión:</b> W&O Taller v1.0
          </p>
        </div>

        {!inline && (
          <button className="btn-logout" style={{ marginTop: '20px' }} onClick={onClose}>Cerrar</button>
        )}
      </div>
    </div>
  )
}

export default Configuracion