import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [session, setSession] = useState({ logged: false, role: '', auth: { email: '', pass: '' } })
  const [view, setView] = useState('login')
  const [tab, setTab] = useState('vehiculos')
  const [data, setData] = useState([])
  const [form, setForm] = useState({})
  const [editItem, setEditItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  // Datos auxiliares para selects
  const [vehiculos, setVehiculos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [clientes, setClientes] = useState([])
  const [presupuestos, setPresupuestos] = useState([])
  const [piezas, setPiezas] = useState([])

  const [regForm, setRegForm] = useState({ nombre: '', apellidos: '', dni: '', email: '', telefono: '', direccion: '', contrasena: '' })

  const api = () => ({
    headers: { Authorization: `Basic ${btoa(session.auth.email + ':' + session.auth.pass)}` }
  })

  const notify = (text, type = 'ok') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  // Para el login
  const handleLogin = (e) => {
    e.preventDefault()
    const cfg = { headers: { Authorization: `Basic ${btoa(session.auth.email + ':' + session.auth.pass)}` } }
    axios.get('/api/empleados', cfg)
      .then(() => {
        // Si llega aquí es ADMIN o EMPLEADO: preguntamos al backend quién es
        axios.get('/api/empleados', cfg).then(res => {
          const match = res.data.find(em => em.email === session.auth.email)
          const role = match?.rol === 'ADMIN' || session.auth.email === 'admin@wo.com' ? 'ADMIN' : 'EMPLEADO'
          setSession(s => ({ ...s, logged: true, role }))
          navigateTo('vehiculos', cfg)
        })
      })
      .catch(() => {
        // Puede ser cliente
        axios.get('/api/clientes', cfg)
          .then(res => {
            const match = res.data.find(c => c.email === session.auth.email)
            if (match) {
              setSession(s => ({ ...s, logged: true, role: 'CLIENTE', clienteId: match.id }))
              setData([match])
              setTab('miPerfil')
            } else {
              alert('Credenciales incorrectas')
            }
          })
          .catch(() => alert('Credenciales incorrectas'))
      })
  }

  // REGISTRO DE CLIENTE
  const handleRegister = (e) => {
    e.preventDefault()
    axios.post('/api/clientes', regForm)
      .then(() => { notify('Cuenta creada. Ya puedes iniciar sesión.'); setView('login') })
      .catch(() => notify('Error al registrar. Comprueba que el DNI/email no exista.', 'err'))
  }

  // CARGAR DATOS
  const loadAux = (cfg) => {
    axios.get('/api/vehiculos', cfg).then(r => setVehiculos(r.data)).catch(() => {})
    axios.get('/api/empleados', cfg).then(r => setEmpleados(r.data)).catch(() => {})
    axios.get('/api/clientes', cfg).then(r => setClientes(r.data)).catch(() => {})
    axios.get('/api/presupuestos', cfg).then(r => setPresupuestos(r.data)).catch(() => {})
    axios.get('/api/piezas', cfg).then(r => setPiezas(r.data)).catch(() => {})
  }

  const navigateTo = (newTab, cfg) => {
    setTab(newTab)
    setForm({})
    setEditItem(null)
    setShowForm(false)
    const config = cfg || api()
    setLoading(true)

    // Para cliente: solo sus propios datos
    if (session.role === 'CLIENTE' || newTab === 'miPerfil') {
      setLoading(false); return
    }

    const endpointMap = {
      vehiculos: 'vehiculos', clientes: 'clientes', empleados: 'empleados',
      citas: 'citas', presupuestos: 'presupuestos', facturas: 'facturas', piezas: 'piezas'
    }
    const endpoint = endpointMap[newTab]
    if (!endpoint) { setLoading(false); return }

    axios.get(`/api/${endpoint}`, config)
      .then(r => { setData(r.data); loadAux(config) })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }

  // GUARDAR (CREAR / EDITAR)
  const onSave = (e) => {
    e.preventDefault()
    const config = api()
    const endpoint = tab

    const buildBody = () => {
      const f = { ...form }
      // Inyectar objetos relacionados si se envían IDs
      if (f.vehiculoId) { f.vehiculo = { id: parseInt(f.vehiculoId) }; delete f.vehiculoId }
      if (f.empleadoId) { f.empleado = { id: parseInt(f.empleadoId) }; delete f.empleadoId }
      if (f.clienteId)  { f.cliente  = { id: parseInt(f.clienteId)  }; delete f.clienteId }
      if (f.presupuestoId) { f.presupuesto = { id: parseInt(f.presupuestoId) }; delete f.presupuestoId }
      return f
    }

    const body = buildBody()
    const req = editItem
      ? axios.put(`/api/${endpoint}/${editItem.id}`, body, config)
      : axios.post(`/api/${endpoint}`, body, config)

    req.then(() => {
      notify(editItem ? 'Actualizado correctamente' : 'Creado correctamente')
      setEditItem(null)
      setShowForm(false)
      navigateTo(tab)
    }).catch(err => {
      notify('Error al guardar: ' + (err.response?.data?.message || err.message), 'err')
    })
  }

  // ELIMINAR
  const onDelete = (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return
    axios.delete(`/api/${tab}/${id}`, api())
      .then(() => { notify('Eliminado'); navigateTo(tab) })
      .catch(() => notify('Error al eliminar', 'err'))
  }

  // EDITAR
  const onEdit = (item) => {
    setEditItem(item)
    setForm({ ...item })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // FORMULARIOS POR SECCIÓN
  const renderForm = () => {
    const f = form
    const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

    const Input = ({ k, label, type = 'text', req = true }) => (
      <div className="field">
        <label>{label}</label>
        <input type={type} value={f[k] || ''} onChange={e => set(k, e.target.value)} required={req} placeholder={label} />
      </div>
    )

    const Select = ({ k, label, options, req = true }) => (
      <div className="field">
        <label>{label}</label>
        <select value={f[k] || ''} onChange={e => set(k, e.target.value)} required={req}>
          <option value="">-- Seleccionar --</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    )

    switch (tab) {
      case 'vehiculos': return (
        <>
          <Input k="matricula" label="Matrícula" />
          <Input k="marca" label="Marca" />
          <Input k="modelo" label="Modelo" />
          <Input k="anio" label="Año" type="number" />
          <Select k="clienteId" label="Cliente" options={clientes.map(c => ({ value: c.id, label: `${c.nombre} ${c.apellidos || ''} (${c.dni})` }))} req={false} />
        </>
      )
      case 'clientes': return (
        <>
          <Input k="nombre" label="Nombre" />
          <Input k="apellidos" label="Apellidos" />
          <Input k="dni" label="DNI" />
          <Input k="email" label="Email" type="email" />
          <Input k="telefono" label="Teléfono" req={false} />
          <Input k="direccion" label="Dirección" req={false} />
          <Input k="contrasena" label="Contraseña" type="password" req={!editItem} />
        </>
      )
      case 'empleados': return (
        <>
          <Input k="nombre" label="Nombre" />
          <Input k="dni" label="DNI" />
          <Input k="email" label="Email" type="email" />
          <Input k="puesto" label="Puesto" req={false} />
          <Input k="telefono" label="Teléfono" req={false} />
          <Input k="contrasena" label="Contraseña" type="password" req={!editItem} />
        </>
      )
      case 'citas': return (
        <>
          <Input k="fecha" label="Fecha" type="date" />
          <Input k="hora" label="Hora" type="time" />
          <Input k="descripcion" label="Descripción" req={false} />
          <Select k="estado" label="Estado" options={['PENDIENTE','CONFIRMADA','CANCELADA','COMPLETADA'].map(v=>({value:v,label:v}))} />
          <Select k="vehiculoId" label="Vehículo" options={vehiculos.map(v => ({ value: v.id, label: `${v.matricula} – ${v.marca} ${v.modelo}` }))} />
          <Select k="empleadoId" label="Empleado" options={empleados.map(e => ({ value: e.id, label: `${e.nombre} (${e.puesto || 'Sin puesto'})` }))} req={false} />
        </>
      )
      case 'presupuestos': return (
        <>
          <Input k="fecha" label="Fecha" type="date" />
          <Input k="total" label="Total (€)" type="number" />
          <Select k="estado" label="Estado" options={['PENDIENTE','ACEPTADO','RECHAZADO'].map(v=>({value:v,label:v}))} />
          <Select k="vehiculoId" label="Vehículo" options={vehiculos.map(v => ({ value: v.id, label: `${v.matricula} – ${v.marca} ${v.modelo}` }))} />
        </>
      )
      case 'facturas': return (
        <>
          <Input k="fecha" label="Fecha" type="date" />
          <Input k="total" label="Total (€)" type="number" />
          <Select k="presupuestoId" label="Presupuesto" options={presupuestos.map(p => ({ value: p.id, label: `#${p.id} – ${p.total}€ (${p.estado})` }))} req={false} />
        </>
      )
      case 'piezas': return (
        <>
          <Input k="nombre" label="Nombre" />
          <Input k="descripcion" label="Descripción" req={false} />
          <Input k="precio" label="Precio (€)" type="number" />
          <Input k="stock" label="Stock" type="number" />
        </>
      )
      default: return null
    }
  }

  // TABLAS POR SECCIÓN
  const renderTable = () => {
    if (loading) return <p className="empty">Cargando...</p>
    if (!data.length) return <p className="empty">No hay registros.</p>

    const acciones = (item) => (
      <td className="acciones">
        <button className="btn-edit" onClick={() => onEdit(item)}>✏️ Editar</button>
        <button className="btn-del" onClick={() => onDelete(item.id)}>🗑️</button>
      </td>
    )

    switch (tab) {
      case 'vehiculos': return (
        <table><thead><tr><th>Matrícula</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Cliente</th><th></th></tr></thead>
          <tbody>{data.map(v => <tr key={v.id}>
            <td><b>{v.matricula}</b></td><td>{v.marca}</td><td>{v.modelo}</td><td>{v.anio}</td>
            <td>{v.cliente ? `${v.cliente.nombre} ${v.cliente.apellidos||''}` : '—'}</td>
            {acciones(v)}
          </tr>)}</tbody>
        </table>
      )
      case 'clientes': return (
        <table><thead><tr><th>Nombre</th><th>Apellidos</th><th>DNI</th><th>Email</th><th>Teléfono</th><th></th></tr></thead>
          <tbody>{data.map(c => <tr key={c.id}>
            <td>{c.nombre}</td><td>{c.apellidos}</td><td>{c.dni}</td><td>{c.email}</td><td>{c.telefono||'—'}</td>
            {acciones(c)}
          </tr>)}</tbody>
        </table>
      )
      case 'empleados': return (
        <table><thead><tr><th>Nombre</th><th>DNI</th><th>Puesto</th><th>Email</th><th></th></tr></thead>
          <tbody>{data.map(e => <tr key={e.id}>
            <td>{e.nombre}</td><td>{e.dni}</td><td>{e.puesto||'—'}</td><td>{e.email}</td>
            {acciones(e)}
          </tr>)}</tbody>
        </table>
      )
      case 'citas': return (
        <table><thead><tr><th>Fecha</th><th>Hora</th><th>Vehículo</th><th>Empleado</th><th>Estado</th><th></th></tr></thead>
          <tbody>{data.map(c => <tr key={c.id}>
            <td>{c.fecha}</td><td>{c.hora}</td>
            <td>{c.vehiculo ? `${c.vehiculo.matricula}` : '—'}</td>
            <td>{c.empleado ? c.empleado.nombre : '—'}</td>
            <td><span className={`badge badge-${c.estado?.toLowerCase()}`}>{c.estado}</span></td>
            {acciones(c)}
          </tr>)}</tbody>
        </table>
      )
      case 'presupuestos': return (
        <table><thead><tr><th>Fecha</th><th>Total</th><th>Estado</th><th>Vehículo</th><th></th></tr></thead>
          <tbody>{data.map(p => <tr key={p.id}>
            <td>{p.fecha}</td><td><b>{p.total}€</b></td>
            <td><span className={`badge badge-${p.estado?.toLowerCase()}`}>{p.estado}</span></td>
            <td>{p.vehiculo ? p.vehiculo.matricula : '—'}</td>
            {acciones(p)}
          </tr>)}</tbody>
        </table>
      )
      case 'facturas': return (
        <table><thead><tr><th>Fecha</th><th>Total</th><th>Presupuesto</th><th></th></tr></thead>
          <tbody>{data.map(f => <tr key={f.id}>
            <td>{f.fecha}</td><td><b>{f.total}€</b></td>
            <td>{f.presupuesto ? `#${f.presupuesto.id}` : '—'}</td>
            {acciones(f)}
          </tr>)}</tbody>
        </table>
      )
      case 'piezas': return (
        <table><thead><tr><th>Nombre</th><th>Descripción</th><th>Stock</th><th>Precio</th><th></th></tr></thead>
          <tbody>{data.map(p => <tr key={p.id}>
            <td>{p.nombre}</td><td>{p.descripcion||'—'}</td>
            <td><span className={p.stock < 5 ? 'stock-low' : 'stock-ok'}>{p.stock} uds</span></td>
            <td>{p.precio}€</td>
            {acciones(p)}
          </tr>)}</tbody>
        </table>
      )
      default: return null
    }
  }

  // VISTA CLIENTE
  const renderClienteView = () => {
    const cfg = api()
    return (
      <div className="cliente-grid">
        <section className="cliente-section">
          <h2>🚗 Mis Vehículos</h2>
          <ClienteSection endpoint="vehiculos" cfg={cfg} render={v =>
            <div className="info-card" key={v.id}><b>{v.matricula}</b><span>{v.marca} {v.modelo} ({v.anio})</span></div>
          } />
        </section>
        <section className="cliente-section">
          <h2>📅 Mis Citas</h2>
          <ClienteSection endpoint="citas" cfg={cfg} render={c =>
            <div className="info-card" key={c.id}>
              <b>{c.fecha} {c.hora}</b>
              <span>{c.descripcion||'Sin descripción'}</span>
              <span className={`badge badge-${c.estado?.toLowerCase()}`}>{c.estado}</span>
            </div>
          } />
        </section>
        <section className="cliente-section">
          <h2>📋 Mis Presupuestos</h2>
          <ClienteSection endpoint="presupuestos" cfg={cfg} render={p =>
            <div className="info-card" key={p.id}>
              <b>{p.fecha} — {p.total}€</b>
              <span className={`badge badge-${p.estado?.toLowerCase()}`}>{p.estado}</span>
            </div>
          } />
        </section>
        <section className="cliente-section">
          <h2>🧾 Mis Facturas</h2>
          <ClienteSection endpoint="facturas" cfg={cfg} render={f =>
            <div className="info-card" key={f.id}><b>{f.fecha}</b><span>{f.total}€</span></div>
          } />
        </section>
      </div>
    )
  }

  // RENDER PRINCIPAL
  if (!session.logged) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-logo">W<span>&</span>O</div>
          <p className="auth-sub">Taller Mecánico</p>
          {msg && <div className={`toast toast-${msg.type}`}>{msg.text}</div>}

          {view === 'login' ? (
            <>
              <h2 className="auth-title">Iniciar sesión</h2>
              <form onSubmit={handleLogin}>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="tu@email.com" required
                    onChange={e => setSession(s => ({ ...s, auth: { ...s.auth, email: e.target.value } }))} />
                </div>
                <div className="field">
                  <label>Contraseña</label>
                  <input type="password" placeholder="••••••••" required
                    onChange={e => setSession(s => ({ ...s, auth: { ...s.auth, pass: e.target.value } }))} />
                </div>
                <button className="btn-primary" type="submit">Acceder</button>
                <p className="auth-link">¿Cliente nuevo? <span onClick={() => setView('register')}>Crear cuenta</span></p>
              </form>
            </>
          ) : (
            <>
              <h2 className="auth-title">Registro de Cliente</h2>
              <form onSubmit={handleRegister}>
                {[['nombre','Nombre'],['apellidos','Apellidos'],['dni','DNI'],['email','Email'],['telefono','Teléfono'],['direccion','Dirección']].map(([k,l]) => (
                  <div className="field" key={k}>
                    <label>{l}</label>
                    <input placeholder={l} value={regForm[k]} onChange={e => setRegForm(r => ({...r,[k]:e.target.value}))} required={['nombre','dni','email'].includes(k)} />
                  </div>
                ))}
                <div className="field">
                  <label>Contraseña</label>
                  <input type="password" placeholder="Contraseña" value={regForm.contrasena} onChange={e => setRegForm(r=>({...r,contrasena:e.target.value}))} required />
                </div>
                <button className="btn-primary" type="submit">Registrarme</button>
                <p className="auth-link"><span onClick={() => setView('login')}>← Volver al login</span></p>
              </form>
            </>
          )}
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'vehiculos', icon: '🚗', label: 'Vehículos', roles: ['ADMIN','EMPLEADO','CLIENTE'] },
    { key: 'citas',     icon: '📅', label: 'Citas',     roles: ['ADMIN','EMPLEADO','CLIENTE'] },
    { key: 'presupuestos', icon: '📋', label: 'Presupuestos', roles: ['ADMIN','EMPLEADO','CLIENTE'] },
    { key: 'facturas',  icon: '🧾', label: 'Facturas',  roles: ['ADMIN','EMPLEADO'] },
    { key: 'clientes',  icon: '👤', label: 'Clientes',  roles: ['ADMIN','EMPLEADO'] },
    { key: 'piezas',    icon: '📦', label: 'Stock',     roles: ['ADMIN','EMPLEADO'] },
    { key: 'empleados', icon: '👨‍🔧', label: 'Empleados', roles: ['ADMIN'] },
  ].filter(t => t.roles.includes(session.role))

  const tabLabel = tabs.find(t => t.key === tab)?.label || tab

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">W<span>&</span>O</div>
        <nav className="sidebar-nav">
          {tabs.map(t => (
            <button key={t.key} className={`nav-item ${tab === t.key ? 'active' : ''}`}
              onClick={() => session.role === 'CLIENTE' ? null : navigateTo(t.key)}>
              <span className="nav-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{session.auth.email[0]?.toUpperCase()}</div>
            <div>
              <p className="user-email">{session.auth.email}</p>
              <span className={`role-badge role-${session.role.toLowerCase()}`}>{session.role}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={() => window.location.reload()}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="main-content">
        {msg && <div className={`toast toast-${msg.type}`}>{msg.text}</div>}

        {session.role === 'CLIENTE' ? renderClienteView() : (
          <>
            <div className="page-header">
              <h1>{tabs.find(t=>t.key===tab)?.icon} {tabLabel}</h1>
              <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditItem(null); setForm({}) }}>
                {showForm ? '✕ Cancelar' : '+ Nuevo'}
              </button>
            </div>

            {showForm && (
              <div className="form-card">
                <h3>{editItem ? `Editar ${tabLabel}` : `Nuevo ${tabLabel}`}</h3>
                <form className="form-grid" onSubmit={onSave}>
                  {renderForm()}
                  <div className="form-actions">
                    <button className="btn-primary" type="submit">
                      {editItem ? 'Guardar cambios' : 'Crear'}
                    </button>
                    <button type="button" className="btn-secondary"
                      onClick={() => { setShowForm(false); setEditItem(null); setForm({}) }}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="table-card">
              {renderTable()}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// Componente auxiliar para secciones del cliente
function ClienteSection({ endpoint, cfg, render }) {
  const [items, setItems] = useState([])
  useEffect(() => {
    axios.get(`/api/${endpoint}`, cfg).then(r => setItems(r.data)).catch(() => {})
  }, [endpoint])
  if (!items.length) return <p className="empty">Sin registros.</p>
  return <div className="info-list">{items.map(render)}</div>
}

export default App
