import React, { useState } from 'react'

const textos = {
  es: {
    titulo:       '⚙️ Configuración',
    temaLabel:    '🎨 Tema de la aplicación',
    idiomaLabel:  '🌐 Idioma',
    passLabel:    '🔒 Cambiar contraseña',
    editar:       '▼ Editar',
    cerrar:       '▲ Cerrar',
    oscuro:       '🌙 Oscuro',
    claro:        '☀️ Claro',
    confirmar:    'Confirmar',
    cancelar:     'Cancelar',
    temaOk:       'Tema actualizado correctamente',
    idiomaOk:     'Idioma guardado',
    passNoMatch:  'Las contraseñas no coinciden',
    passCorta:    'Mínimo 4 caracteres',
    passOk:       'Contraseña actualizada correctamente',
    passActual:   'Contraseña actual',
    passNueva:    'Nueva contraseña',
    passRepetir:  'Repetir nueva contraseña',
    sesion:       'Sesión activa',
    version:      'Versión',
    cerrarBtn:    'Cerrar',
    selectIdioma: 'Selecciona idioma',
  },
  en: {
    titulo:       '⚙️ Settings',
    temaLabel:    '🎨 App Theme',
    idiomaLabel:  '🌐 Language',
    passLabel:    '🔒 Change Password',
    editar:       '▼ Edit',
    cerrar:       '▲ Close',
    oscuro:       '🌙 Dark',
    claro:        '☀️ Light',
    confirmar:    'Confirm',
    cancelar:     'Cancel',
    temaOk:       'Theme updated',
    idiomaOk:     'Language saved',
    passNoMatch:  'Passwords do not match',
    passCorta:    'Minimum 4 characters',
    passOk:       'Password updated',
    passActual:   'Current password',
    passNueva:    'New password',
    passRepetir:  'Repeat new password',
    sesion:       'Active session',
    version:      'Version',
    cerrarBtn:    'Close',
    selectIdioma: 'Select language',
  }
}

function Configuracion({ tema, onTema, onClose, sesion, authConfig, notify, inline, idioma, onIdioma }) {

  const [temaLocal,      setTemaLocal]      = useState(tema)
  const [passForm,       setPassForm]       = useState({ actual: '', nueva: '', repetir: '' })
  const [seccionAbierta, setSeccionAbierta] = useState(null)
  const [idiomaLocal,    setIdiomaLocal]    = useState(idioma || 'es')

  const t = textos[idiomaLocal] || textos['es']

  const confirmarTema = () => {
    onTema(temaLocal)
    notify(t.temaOk)
    setSeccionAbierta(null)
  }

  const cancelarTema = () => {
    setTemaLocal(tema)
    setSeccionAbierta(null)
  }

  const confirmarIdioma = () => {
    if (onIdioma) onIdioma(idiomaLocal)
    notify(t.idiomaOk)
    setSeccionAbierta(null)
  }

  const cancelarIdioma = () => {
    setIdiomaLocal(idioma || 'es')
    setSeccionAbierta(null)
  }

  const confirmarContrasena = (e) => {
    e.preventDefault()
    if (passForm.nueva !== passForm.repetir) { notify(t.passNoMatch, 'err'); return }
    if (passForm.nueva.length < 4)           { notify(t.passCorta,   'err'); return }
    notify(t.passOk)
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
            <h2>{t.titulo}</h2>
            <button className="btn-del" onClick={onClose}>✕</button>
          </div>
        )}

        <div style={estiloSeccion}>
          <div style={estiloTituloSeccion} onClick={() => setSeccionAbierta(seccionAbierta === 'tema' ? null : 'tema')}>
            <h3 style={{ margin: 0 }}>{t.temaLabel}</h3>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{seccionAbierta === 'tema' ? t.cerrar : t.editar}</span>
          </div>

          {seccionAbierta === 'tema' && (
            <div style={{ marginTop: '18px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                <button className={temaLocal === 'dark'  ? 'login-btn' : 'btn-cancel'} style={{ flex: 1 }} onClick={() => setTemaLocal('dark')}>{t.oscuro}</button>
                <button className={temaLocal === 'light' ? 'login-btn' : 'btn-cancel'} style={{ flex: 1 }} onClick={() => setTemaLocal('light')}>{t.claro}</button>
              </div>
              <div className="form-actions">
                <button className="login-btn" onClick={confirmarTema}>{t.confirmar}</button>
                <button className="btn-cancel" onClick={cancelarTema}>{t.cancelar}</button>
              </div>
            </div>
          )}
        </div>

        <div style={estiloSeccion}>
          <div style={estiloTituloSeccion} onClick={() => setSeccionAbierta(seccionAbierta === 'idioma' ? null : 'idioma')}>
            <h3 style={{ margin: 0 }}>{t.idiomaLabel}</h3>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{seccionAbierta === 'idioma' ? t.cerrar : t.editar}</span>
          </div>

          {seccionAbierta === 'idioma' && (
            <div style={{ marginTop: '18px' }}>
              <div className="field">
                <label>{t.selectIdioma}</label>
                <select value={idiomaLocal} onChange={e => setIdiomaLocal(e.target.value)} style={{ width: '100%' }}>
                  <option value="es">🇪🇸 Español</option>
                  <option value="en">🇬🇧 English</option>
                </select>
              </div>
              <div className="form-actions" style={{ marginTop: '14px' }}>
                <button className="login-btn" onClick={confirmarIdioma}>{t.confirmar}</button>
                <button className="btn-cancel" onClick={cancelarIdioma}>{t.cancelar}</button>
              </div>
            </div>
          )}
        </div>

        <div style={estiloSeccion}>
          <div style={estiloTituloSeccion} onClick={() => setSeccionAbierta(seccionAbierta === 'pass' ? null : 'pass')}>
            <h3 style={{ margin: 0 }}>{t.passLabel}</h3>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{seccionAbierta === 'pass' ? t.cerrar : t.editar}</span>
          </div>

          {seccionAbierta === 'pass' && (
            <form onSubmit={confirmarContrasena} style={{ marginTop: '18px' }}>
              {[['actual', t.passActual], ['nueva', t.passNueva], ['repetir', t.passRepetir]].map(([k, l]) => (
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
                <button className="login-btn" type="submit">{t.confirmar}</button>
                <button type="button" className="btn-cancel" onClick={cancelarContrasena}>{t.cancelar}</button>
              </div>
            </form>
          )}
        </div>

        <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
            <b>{t.sesion}:</b> {sesion?.auth?.email}<br />
            <b>Rol:</b> {sesion?.rol}<br />
            <b>{t.version}:</b> W&O Taller v1.0
          </p>
        </div>

        {!inline && (
          <button className="btn-logout" style={{ marginTop: '20px' }} onClick={onClose}>{t.cerrarBtn}</button>
        )}
      </div>
    </div>
  )
}

export default Configuracion