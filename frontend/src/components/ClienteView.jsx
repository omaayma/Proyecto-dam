import React, { useState } from 'react'
import axios from 'axios'
import { jsPDF } from 'jspdf'

function ClienteView({
  tab, setTab, sesion,
  vehiculos, citas, presupuestos, facturas,
  authConfig, notify,
  onSave, form, setForm, mostrarForm, setMostrarForm,
  editando, setEditando, emptyFormByTab, cargarDatosCliente
}) {

  const [mostrarMensaje,  setMostrarMensaje]  = useState(false)
  const [mensaje,         setMensaje]         = useState({ asunto: '', texto: '' })
  const [mostrarPerfil,   setMostrarPerfil]   = useState(false)
  const [perfilForm,      setPerfilForm]      = useState({ nombre: sesion.nombre || '', telefono: '', direccion: '', contrasena: '' })

  const generarPDFFactura = (f) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('W&O TALLER MECÁNICO', 105, 25, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setDrawColor(100, 100, 100)
    doc.line(20, 32, 190, 32)

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Factura #${f.id}`, 20, 45)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha:`, 20, 58)
    doc.setFont('helvetica', 'bold')
    doc.text(`${f.fecha || '—'}`, 55, 58)

    doc.setFont('helvetica', 'normal')
    doc.text(`Total:`, 20, 68)
    doc.setFont('helvetica', 'bold')
    doc.text(`${f.total}€`, 55, 68)

    doc.setFont('helvetica', 'normal')
    doc.text(`Presupuesto vinculado:`, 20, 78)
    doc.setFont('helvetica', 'bold')
    doc.text(f.presupuesto ? `#${f.presupuesto.id}` : 'Sin presupuesto', 80, 78)

    doc.setDrawColor(100, 100, 100)
    doc.line(20, 88, 190, 88)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(120, 120, 120)
    doc.text('Gracias por confiar en W&O Taller Mecánico', 105, 100, { align: 'center' })

    doc.save(`factura_${f.id}.pdf`)
  }

  const enviarMensaje = (e) => {
    e.preventDefault()
    notify('Mensaje enviado al taller. Te contactaremos pronto.')
    setMostrarMensaje(false)
    setMensaje({ asunto: '', texto: '' })
  }

  const guardarPerfil = (e) => {
    e.preventDefault()
    const body = { ...perfilForm }
    axios.put(`/api/clientes/${sesion.clienteId}`, body, authConfig())
      .then(() => { notify('Perfil actualizado'); setMostrarPerfil(false) })
      .catch(() => notify('Error al actualizar perfil', 'err'))
  }

  return (
    <div className="cliente-view-wrapper">
      <h1 className="dashboard-welcome">Bienvenido, {sesion.nombre}</h1>

      <div className="cliente-tabs-nav">
        {[['dashboard','🏠 Inicio'],['vehiculos','🚗 Vehículos'],['citas','📅 Citas'],['presupuestos','📋 Presupuestos'],['facturas','🧾 Facturas'],['perfil','👤 Mi Perfil']].map(([k,l]) => (
          <button key={k} className={`cliente-tab-btn ${tab === k ? 'active' : ''}`} onClick={() => { setTab(k); setMostrarForm(false) }}>{l}</button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="cliente-grid-layout">
          <div className="panel-seccion">
            <h3>🚗 Mis Vehículos</h3>
            {vehiculos.length === 0 ? <p className="empty-text">Sin vehículos registrados.</p> : vehiculos.map(v => (
              <div className="tarjeta-dato" key={v.id}><label>{v.matricula}</label><span>{v.marca} {v.modelo} ({v.anio})</span></div>
            ))}
          </div>
          <div className="panel-seccion">
            <h3>📅 Próximas Citas</h3>
            {citas.filter(c => c.estado !== 'CANCELADA').slice(0, 3).map(c => (
              <div className="tarjeta-dato" key={c.id}>
                <label>{c.fecha} - {c.hora}</label>
                <span>{c.descripcion || 'Sin descripción'}</span>
                <span className={`badge badge-${c.estado?.toLowerCase()}`}>{c.estado}</span>
              </div>
            ))}
            {citas.filter(c => c.estado !== 'CANCELADA').length === 0 && <p className="empty-text">Sin citas.</p>}
          </div>
          <div className="panel-seccion">
            <h3>📋 Últimos Presupuestos</h3>
            {presupuestos.slice(0, 3).map(p => (
              <div className="tarjeta-dato" key={p.id}>
                <label>Presupuesto #{p.id} - {p.fecha}</label>
                <span>{p.total}€</span>
                <span className={`badge badge-${p.estado?.toLowerCase()}`}>{p.estado}</span>
              </div>
            ))}
            {presupuestos.length === 0 && <p className="empty-text">Sin presupuestos.</p>}
          </div>
          <div className="panel-seccion">
            <h3>Acciones rápidas</h3>
            <button className="login-btn" style={{ marginBottom: '10px' }} onClick={() => { setTab('citas'); setForm(emptyFormByTab('citas','CLIENTE')); setMostrarForm(true) }}>📅 Solicitar cita</button>
            <button className="btn-cancel" style={{ width: '100%', padding: '12px', borderRadius: '10px' }} onClick={() => setMostrarMensaje(true)}>✉️ Enviar mensaje al taller</button>
          </div>
        </div>
      )}

      {tab === 'vehiculos' && (
        <div className="panel-seccion">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>🚗 Mis Vehículos</h3>
            <button className="login-btn" onClick={() => { setForm(emptyFormByTab('vehiculos','CLIENTE')); setMostrarForm(true); setEditando(null) }}>+ Añadir vehículo</button>
          </div>
          {vehiculos.length === 0 ? <p className="empty-text">Sin vehículos registrados.</p> : vehiculos.map(v => (
            <div className="tarjeta-dato" key={v.id}>
              <label>{v.matricula}</label>
              <span>{v.marca} {v.modelo} — {v.anio}</span>
            </div>
          ))}
          {mostrarForm && (
            <form onSubmit={onSave} style={{ marginTop: '20px' }}>
              <div className="form-grid">
                {['matricula','marca','modelo','anio'].map(k => (
                  <div className="field" key={k}>
                    <label>{k}</label>
                    <input key={`cli-v-${k}`} value={form[k] || ''} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} required />
                  </div>
                ))}
              </div>
              <div className="form-actions">
                <button className="login-btn" type="submit">Guardar</button>
                <button type="button" className="btn-cancel" onClick={() => setMostrarForm(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      )}

      {tab === 'citas' && (
        <div className="panel-seccion">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>📅 Mis Citas</h3>
            <button className="login-btn" onClick={() => { setForm(emptyFormByTab('citas','CLIENTE')); setMostrarForm(true); setEditando(null) }}>+ Solicitar cita</button>
          </div>
          {citas.map(c => (
            <div className="tarjeta-dato" key={c.id}>
              <label>{c.fecha} a las {c.hora}</label>
              <span>{c.descripcion || 'Sin descripción'}</span>
              <span className={`badge badge-${c.estado?.toLowerCase()}`}>{c.estado}</span>
            </div>
          ))}
          {citas.length === 0 && <p className="empty-text">Sin citas registradas.</p>}
          {mostrarForm && (
            <form onSubmit={onSave} style={{ marginTop: '20px' }}>
              <div className="form-grid">
                <div className="field"><label>Fecha</label><input key="cli-cita-fecha" type="date" value={form.fecha || ''} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))} required /></div>
                <div className="field"><label>Hora</label><input key="cli-cita-hora" type="time" value={form.hora || ''} onChange={e => setForm(p => ({ ...p, hora: e.target.value }))} required /></div>
                <div className="field"><label>Descripción</label><input key="cli-cita-desc" value={form.descripcion || ''} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} /></div>
                <div className="field">
                  <label>Vehículo</label>
                  <select value={form.vehiculoId || ''} onChange={e => setForm(p => ({ ...p, vehiculoId: e.target.value }))} required>
                    <option value="">Seleccionar vehículo</option>
                    {vehiculos.map(v => <option key={v.id} value={v.id}>{v.matricula} - {v.marca}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button className="login-btn" type="submit">Solicitar</button>
                <button type="button" className="btn-cancel" onClick={() => setMostrarForm(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      )}

      {tab === 'presupuestos' && (
        <div className="panel-seccion">
          <h3>📋 Mis Presupuestos</h3>
          {presupuestos.length === 0 ? <p className="empty-text">Sin presupuestos.</p> : presupuestos.map(p => (
            <div className="tarjeta-dato" key={p.id}>
              <label>Presupuesto #{p.id} — {p.fecha}</label>
              <span style={{ fontSize: '22px', fontWeight: '900' }}>{p.total}€</span>
              <span className={`badge badge-${p.estado?.toLowerCase()}`}>{p.estado}</span>
              {p.vehiculo && <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Vehículo: {p.vehiculo.matricula}</span>}
            </div>
          ))}
        </div>
      )}

      {tab === 'facturas' && (
        <div className="panel-seccion">
          <h3>🧾 Mis Facturas</h3>
          {facturas.length === 0 ? <p className="empty-text">Sin facturas.</p> : facturas.map(f => (
            <div className="tarjeta-dato" key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <label>Factura #{f.id} — {f.fecha}</label>
                <span style={{ fontSize: '22px', fontWeight: '900' }}>{f.total}€</span>
              </div>
              <button className="btn-edit" onClick={() => generarPDFFactura(f)}>📄 Descargar</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'perfil' && (
        <div className="panel-seccion" style={{ maxWidth: '500px' }}>
          <h3>👤 Mis Datos</h3>
          <form onSubmit={guardarPerfil}>
            {[['nombre','Nombre'],['telefono','Teléfono'],['direccion','Dirección']].map(([k,l]) => (
              <div className="field" key={k}>
                <label>{l}</label>
                <input value={perfilForm[k] || ''} onChange={e => setPerfilForm(p => ({ ...p, [k]: e.target.value }))} />
              </div>
            ))}
            <div className="field">
              <label>Nueva contraseña (dejar vacío para no cambiar)</label>
              <input type="password" placeholder="Nueva contraseña" value={perfilForm.contrasena} onChange={e => setPerfilForm(p => ({ ...p, contrasena: e.target.value }))} />
            </div>
            <div className="form-actions">
              <button className="login-btn" type="submit">Guardar cambios</button>
            </div>
          </form>
        </div>
      )}

      {mostrarMensaje && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>✉️ Enviar mensaje al taller</h3>
            <form onSubmit={enviarMensaje}>
              <div className="field"><label>Asunto</label><input value={mensaje.asunto} onChange={e => setMensaje(m => ({ ...m, asunto: e.target.value }))} required /></div>
              <div className="field"><label>Mensaje</label><textarea value={mensaje.texto} onChange={e => setMensaje(m => ({ ...m, texto: e.target.value }))} rows={4} required style={{ background: '#020617', border: '1px solid var(--line)', color: 'white', padding: '12px', borderRadius: '10px', width: '100%' }} /></div>
              <div className="modal-actions">
                <button className="login-btn" type="submit">Enviar</button>
                <button type="button" className="btn-secondary" onClick={() => setMostrarMensaje(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClienteView