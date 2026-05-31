import { useState, useEffect } from 'react'
import axios from 'axios'
import './assets/App.css'

import Vehiculos       from './components/Vehiculos'
import Clientes        from './components/Clientes'
import Empleados       from './components/Empleados'
import Citas           from './components/Citas'
import Presupuestos    from './components/Presupuestos'
import Facturas        from './components/Facturas'
import Piezas          from './components/Piezas'
import Sidebar         from './components/Sidebar'
import Header          from './components/Header'
import Modal           from './components/Modal'
import Buscador        from './components/Buscador'
import ClienteView     from './components/ClienteView'
import CalendarioCitas from './components/CalendarioCitas'
import Dashboard       from './components/Dashboard'
import Configuracion   from './components/Configuracion'
import Landing         from './components/Landing'
import Mensajes        from './components/Mensajes'

function App() {

  const [view, setView] = useState('landing')

  const [sesion, setSesion] = useState(() => {
    const saved = sessionStorage.getItem('sesion')
    return saved ? JSON.parse(saved) : {
      logueado: false, rol: '', nombre: '', clienteId: null,
      auth: { email: '', pass: '' }
    }
  })

  useEffect(() => {
    sessionStorage.setItem('sesion', JSON.stringify(sesion))
  }, [sesion])

  const [tab,             setTab]             = useState('')
  const [data,            setData]            = useState([])
  const [search,          setSearch]          = useState('')
  const [mostrarForm,     setMostrarForm]     = useState(false)
  const [editando,        setEditando]        = useState(null)
  const [toast,           setToast]           = useState(null)
  const [modalEliminar,   setModalEliminar]   = useState({ open: false, id: null })
  const [vistaCalendario, setVistaCalendario] = useState(false)
  const [mostrarConfig,   setMostrarConfig]   = useState(false)
  const [tema,            setTema]            = useState(localStorage.getItem('tema')   || 'dark')
  const [idioma,          setIdioma]          = useState(localStorage.getItem('idioma') || 'es')
  const [statsAdmin,      setStatsAdmin]      = useState(null)

  const [vehiculos,    setVehiculos]    = useState([])
  const [empleados,    setEmpleados]    = useState([])
  const [clientes,     setClientes]     = useState([])
  const [presupuestos, setPresupuestos] = useState([])

  const [form, setForm] = useState({})

  const [vehiculosCliente,    setVehiculosCliente]    = useState([])
  const [citasCliente,        setCitasCliente]        = useState([])
  const [presupuestosCliente, setPresupuestosCliente] = useState([])
  const [facturasCliente,     setFacturasCliente]     = useState([])

  const rol = sesion?.rol?.toUpperCase()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
    localStorage.setItem('tema', tema)
  }, [tema])

  useEffect(() => {
    localStorage.setItem('idioma', idioma)
  }, [idioma])

  useEffect(() => {
    if (sesion.logueado) setTab('dashboard')
  }, [sesion.logueado])

  const notify = (text, type = 'ok') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 3500)
  }

  const authConfig = () => ({
    headers: { Authorization: `Basic ${btoa(sesion.auth.email + ':' + sesion.auth.pass)}` }
  })

  const validarEmail     = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const validarDni       = (d) => /^[0-9]{8}[A-Za-z]$/.test(d)
  const validarMatricula = (m) => /^[0-9]{4}[A-Za-z]{3}$/.test(m)

  const cargarDatosCliente = () => {
    const cfg = authConfig()
    axios.get('/api/vehiculos',    cfg).then(r => setVehiculosCliente(r.data.filter(v => v?.cliente?.id === sesion.clienteId))).catch(() => {})
    axios.get('/api/citas',        cfg).then(r => setCitasCliente(r.data.filter(c => c?.vehiculo?.cliente?.id === sesion.clienteId))).catch(() => {})
    axios.get('/api/presupuestos', cfg).then(r => setPresupuestosCliente(r.data.filter(p => p?.vehiculo?.cliente?.id === sesion.clienteId))).catch(() => {})
    axios.get('/api/facturas',     cfg).then(r => setFacturasCliente(r.data)).catch(() => {})
  }

  const cargarStats = () => {
    const cfg = authConfig()
    Promise.all([
      axios.get('/api/clientes',     cfg),
      axios.get('/api/vehiculos',    cfg),
      axios.get('/api/empleados',    cfg),
      axios.get('/api/citas',        cfg),
      axios.get('/api/presupuestos', cfg),
      axios.get('/api/facturas',     cfg),
      axios.get('/api/piezas',       cfg),
    ]).then(([c, v, e, ci, p, f, pz]) => {
      const hoy = new Date().toISOString().split('T')[0]
      const piezasBajas = pz.data.filter(x => x.stock < 5)
      setStatsAdmin({
        clientes:               c.data.length,
        vehiculos:              v.data.length,
        empleados:              e.data.filter(em => em.rol !== 'ADMIN').length,
        citasHoy:               ci.data.filter(x => x.fecha === hoy).length,
        citasPendientes:        ci.data.filter(x => x.estado === 'PENDIENTE').length,
        presupuestosPendientes: p.data.filter(x => x.estado === 'PENDIENTE').length,
        ingresosMes:            f.data.reduce((sum, x) => sum + (x.total || 0), 0),
        stockBajo:              piezasBajas.length,
        todasCitas:             ci.data,
        piezasBajas,
      })
      if (piezasBajas.length > 0) {
        const msgs = JSON.parse(localStorage.getItem('mensajes_admin') || '[]')
        const yaExiste = msgs.find(m => m.tipo === 'stock' && m.fecha === hoy)
        if (!yaExiste) {
          msgs.unshift({ id: Date.now(), tipo: 'stock', fecha: hoy, leido: false, asunto: 'Alerta de stock bajo', texto: `Las siguientes piezas tienen stock bajo: ${piezasBajas.map(p => p.nombre + ' (' + p.stock + ' uds)').join(', ')}` })
          localStorage.setItem('mensajes_admin', JSON.stringify(msgs))
        }
      }
    }).catch(() => {})
  }

  useEffect(() => {
    if (!sesion.logueado) return
    if (rol === 'CLIENTE') { cargarDatosCliente(); return }
    if (tab === 'dashboard') { cargarStats(); return }
    if (!tab || tab === 'configuracion' || tab === 'mensajes') return

    axios.get(`/api/${tab}`, authConfig()).then(r => setData(r.data)).catch(() => setData([]))
    axios.get('/api/vehiculos',    authConfig()).then(r => setVehiculos(r.data)).catch(() => {})
    axios.get('/api/empleados',    authConfig()).then(r => setEmpleados(r.data)).catch(() => {})
    axios.get('/api/clientes',     authConfig()).then(r => setClientes(r.data)).catch(() => {})
    axios.get('/api/presupuestos', authConfig()).then(r => setPresupuestos(r.data)).catch(() => {})
  }, [tab, sesion.logueado])

  const handleLogin = (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const pass  = e.target.password.value
    const cfg   = { headers: { Authorization: `Basic ${btoa(email + ':' + pass)}` } }
    axios.get('/api/auth/me', cfg)
      .then(res => {
        setSesion({ logueado: true, rol: res.data.rol, nombre: res.data.nombre, clienteId: res.data.clienteId || null, auth: { email, pass } })
        notify('Bienvenido, ' + res.data.nombre)
      })
      .catch(() => notify('Credenciales incorrectas', 'err'))
  }

  const handleRegister = (e) => {
    e.preventDefault()
    const body = {
      nombre:     e.target.nombre.value,
      apellidos:  e.target.apellidos.value,
      dni:        e.target.dni.value,
      email:      e.target.email.value,
      telefono:   e.target.telefono.value,
      direccion:  e.target.direccion.value,
      contrasena: e.target.password.value
    }
    if (!validarEmail(body.email))  { notify('Email inválido', 'err'); return }
    if (!validarDni(body.dni))      { notify('DNI inválido (ej: 12345678A)', 'err'); return }
    if (body.contrasena.length < 4) { notify('Contraseña mínimo 4 caracteres', 'err'); return }
    axios.post('/api/clientes', body)
      .then(() => { notify('Cuenta creada. Ya puedes iniciar sesión.'); setView('login') })
      .catch(err => {
        if (err.response?.status === 409 || err.response?.status === 500) {
          notify('Ya existe una cuenta con ese DNI o email', 'err')
        } else {
          notify('Error al registrar. Comprueba los datos.', 'err')
        }
      })
  }

  const emptyFormByTab = (t, rolUpper) => {
    if (rolUpper === 'CLIENTE') {
      if (t === 'citas')     return { fecha: '', hora: '', descripcion: '', estado: 'PENDIENTE', vehiculoId: '' }
      if (t === 'vehiculos') return { matricula: '', marca: '', modelo: '', anio: '' }
      return {}
    }
    const map = {
      vehiculos:    { matricula: '', marca: '', modelo: '', anio: '' },
      clientes:     { nombre: '', apellidos: '', dni: '', email: '', telefono: '', direccion: '', contrasena: '' },
      empleados:    { nombre: '', apellidos: '', dni: '', email: '', puesto: '', telefono: '', contrasena: '', rol: 'EMPLEADO' },
      citas:        { fecha: '', hora: '', descripcion: '', estado: 'PENDIENTE', vehiculoId: '', empleadoId: '' },
      presupuestos: { fecha: '', total: '', estado: 'PENDIENTE', vehiculoId: '' },
      facturas:     { fecha: '', total: '', presupuestoId: '' },
      piezas:       { nombre: '', descripcion: '', precio: '', stock: '' },
    }
    return map[t] || {}
  }

  const onEdit = (item) => {
    setEditando(item)
    if (tab === 'citas') {
      setForm({ ...item, vehiculoId: item?.vehiculo?.id || '', empleadoId: item?.empleado?.id || '', vehiculo: undefined, empleado: undefined })
    } else if (tab === 'presupuestos') {
      setForm({ ...item, vehiculoId: item?.vehiculo?.id || '', vehiculo: undefined })
    } else if (tab === 'facturas') {
      setForm({ ...item, presupuestoId: item?.presupuesto?.id || '', presupuesto: undefined })
    } else if (tab === 'vehiculos') {
      setForm({ ...item, clienteId: item?.cliente?.id || '', cliente: undefined })
    } else {
      setForm({ ...item })
    }
    setMostrarForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onDelete = (id) => setModalEliminar({ open: true, id })

  const confirmarEliminar = () => {
    axios.delete(`/api/${tab}/${modalEliminar.id}`, authConfig())
      .then(() => {
        setData(prev => prev.filter(i => i.id !== modalEliminar.id))
        notify('Registro eliminado')
        setModalEliminar({ open: false, id: null })
      })
      .catch(() => notify('Error al eliminar', 'err'))
  }

  const onSave = (e) => {
    e.preventDefault()
    if (form.email     && !validarEmail(form.email))         { notify('Email inválido', 'err'); return }
    if (form.dni       && !validarDni(form.dni))             { notify('DNI inválido (ej: 12345678A)', 'err'); return }
    if (form.matricula && !validarMatricula(form.matricula)) { notify('Matrícula inválida (ej: 1234ABC)', 'err'); return }

    const body = { ...form }
    if (rol === 'CLIENTE') {
      if (tab === 'vehiculos') body.cliente = { id: sesion.clienteId }
      if (tab === 'citas') {
        if (!vehiculosCliente.some(v => v.id === parseInt(body.vehiculoId || '0'))) {
          notify('Selecciona uno de tus vehículos', 'err'); return
        }
        body.estado = body.estado || 'PENDIENTE'
      }
    }
    if (body.vehiculoId)    { body.vehiculo    = { id: parseInt(body.vehiculoId) };    delete body.vehiculoId }
    if (body.empleadoId)    { body.empleado    = { id: parseInt(body.empleadoId) };    delete body.empleadoId }
    if (body.clienteId)     { body.cliente     = { id: parseInt(body.clienteId) };     delete body.clienteId }
    if (body.presupuestoId) { body.presupuesto = { id: parseInt(body.presupuestoId) }; delete body.presupuestoId }

    const req = editando
      ? axios.put(`/api/${tab}/${editando.id}`, body, authConfig())
      : axios.post(`/api/${tab}`, body, authConfig())

    req.then(() => {
      notify(editando ? 'Actualizado correctamente' : 'Creado correctamente')
      setMostrarForm(false); setEditando(null); setForm({})
      if (rol === 'CLIENTE') { cargarDatosCliente(); return }
      axios.get(`/api/${tab}`, authConfig()).then(r => setData(r.data))
    }).catch(err => {
      if (err.response?.status === 409 || err.response?.status === 500) {
        notify('Ya existe un registro con ese DNI, email o matrícula', 'err')
      } else {
        notify('Error al guardar: ' + (err.response?.data?.message || err.message), 'err')
      }
    })
  }

  const exportarCSV = () => {
    if (!data.length) return
    const keys = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object')
    const csv  = [keys.join(','), ...data.map(r => keys.map(k => `"${r[k] ?? ''}"`).join(','))].join('\n')
    const a    = document.createElement('a')
    a.href     = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `${tab}.csv`
    a.click()
  }

  const logout = () => {
    sessionStorage.removeItem('sesion')
    setSesion({ logueado: false, rol: '', nombre: '', clienteId: null, auth: { email: '', pass: '' } })
    setView('landing')
  }

  if (view === 'landing' && !sesion.logueado) {
    return <Landing onLogin={() => setView('login')} onRegister={() => setView('register')} idioma={idioma} />
  }

  if (!sesion.logueado) {
    return (
      <div className="auth-wrapper">
        {toast && <div className={`toast toast-${toast.type}`}>{toast.text}</div>}
        <div className="auth-card">
          <div className="auth-logo-img">
            <img src="/logo.png" alt="W&O" style={{ height: '60px', objectFit: 'contain' }} />
          </div>
          {view === 'login' ? (
            <>
              <h2 className="auth-title">Iniciar sesión</h2>
              <form onSubmit={handleLogin}>
                <div className="field"><label>Email</label><input name="email" type="email" placeholder="tu@email.com" required /></div>
                <div className="field"><label>Contraseña</label><input name="password" type="password" placeholder="••••••••" required /></div>
                <button className="login-btn" type="submit">Acceder</button>
                <p className="auth-switch">¿Cliente nuevo? <span onClick={() => setView('register')}>Crear cuenta</span></p>
                <p className="auth-switch"><span onClick={() => setView('landing')} style={{ color: 'var(--muted)', fontSize: '12px' }}>← Volver al inicio</span></p>
              </form>
            </>
          ) : (
            <>
              <h2 className="auth-title">Registro</h2>
              <form onSubmit={handleRegister}>
                {[['nombre','Nombre'],['apellidos','Apellidos'],['dni','DNI (ej: 12345678A)'],['email','Email'],['telefono','Teléfono'],['direccion','Dirección']].map(([n,l]) => (
                  <div className="field" key={n}><label>{l}</label><input name={n} placeholder={l} required={['nombre','dni','email'].includes(n)} /></div>
                ))}
                <div className="field"><label>Contraseña</label><input name="password" type="password" placeholder="Mínimo 4 caracteres" required /></div>
                <button className="login-btn" type="submit">Registrarme</button>
                <p className="auth-switch"><span onClick={() => setView('login')}>← Volver al login</span></p>
              </form>
            </>
          )}
        </div>
      </div>
    )
  }

  const mensajesNoLeidos = JSON.parse(localStorage.getItem('mensajes_admin') || '[]').filter(m => !m.leido).length

  return (
    <div className="app-layout">
      {toast && <div className={`toast toast-${toast.type}`}>{toast.text}</div>}

      <Modal
        open={modalEliminar.open}
        title="Eliminar registro"
        text="¿Seguro que deseas eliminar este registro? Esta acción no se puede deshacer."
        onConfirm={confirmarEliminar}
        onCancel={() => setModalEliminar({ open: false, id: null })}
      />

      <Sidebar
        session={sesion}
        tab={tab}
        setTab={(t) => { setTab(t); setMostrarForm(false); setSearch(''); setVistaCalendario(false) }}
        logout={logout}
        onConfig={() => setMostrarConfig(true)}
        stockAlerta={statsAdmin?.stockBajo > 0}
        mensajesNoLeidos={mensajesNoLeidos}
      />

      <main className="contenido-principal">

        {mostrarConfig && (
          <Configuracion
            tema={tema}
            onTema={setTema}
            onClose={() => setMostrarConfig(false)}
            sesion={sesion}
            authConfig={authConfig}
            notify={notify}
            idioma={idioma}
            onIdioma={setIdioma}
          />
        )}

        {rol === 'CLIENTE' && (
          <ClienteView
            tab={tab}
            setTab={setTab}
            sesion={sesion}
            vehiculos={vehiculosCliente}
            citas={citasCliente}
            presupuestos={presupuestosCliente}
            facturas={facturasCliente}
            authConfig={authConfig}
            notify={notify}
            onSave={onSave}
            form={form}
            setForm={setForm}
            mostrarForm={mostrarForm}
            setMostrarForm={setMostrarForm}
            editando={editando}
            setEditando={setEditando}
            emptyFormByTab={emptyFormByTab}
            cargarDatosCliente={cargarDatosCliente}
            idioma={idioma}
          />
        )}

        {rol !== 'CLIENTE' && tab === 'dashboard' && (
          <Dashboard stats={statsAdmin} rol={rol} onNavigate={(t) => { setTab(t); setMostrarForm(false) }} />
        )}

        {rol !== 'CLIENTE' && tab === 'mensajes' && (
          <Mensajes />
        )}

        {rol !== 'CLIENTE' && tab !== 'dashboard' && tab !== 'configuracion' && tab !== 'mensajes' && (
          <>
            <Header
              title={`Gestión de ${tab}`}
              onNew={() => { setMostrarForm(true); setEditando(null); setForm(emptyFormByTab(tab, rol)) }}
              onExport={exportarCSV}
              mostrarCalendario={tab === 'citas'}
              vistaCalendario={vistaCalendario}
              onToggleCalendario={() => setVistaCalendario(v => !v)}
            />

            {tab === 'piezas' && data.some(p => p.stock < 5) && (
              <div className="alerta-stock">
                ⚠️ Hay {data.filter(p => p.stock < 5).length} pieza(s) con stock bajo (menos de 5 unidades)
              </div>
            )}

            <Buscador value={search} onChange={setSearch} />

            {tab === 'citas' && vistaCalendario ? (
              <CalendarioCitas
                citas={data}
                onNuevaCita={(fecha) => { setForm({ ...emptyFormByTab('citas', rol), fecha }); setMostrarForm(true); setVistaCalendario(false) }}
              />
            ) : (
              <div className="tabla-card">
                {tab === 'vehiculos'                    && <Vehiculos    data={data} search={search} onEdit={onEdit} onDelete={onDelete} />}
                {tab === 'clientes'                     && <Clientes     data={data} search={search} onEdit={onEdit} onDelete={onDelete} />}
                {tab === 'empleados' && rol === 'ADMIN' && <Empleados    data={data} search={search} onEdit={onEdit} onDelete={onDelete} />}
                {tab === 'citas'                        && <Citas        data={data} search={search} onEdit={onEdit} onDelete={onDelete} />}
                {tab === 'presupuestos'                 && <Presupuestos data={data} search={search} onEdit={onEdit} onDelete={onDelete} />}
                {tab === 'facturas'                     && <Facturas     data={data} search={search} onEdit={onEdit} onDelete={onDelete} authConfig={authConfig} />}
                {tab === 'piezas'                       && <Piezas       data={data} search={search} onEdit={onEdit} onDelete={onDelete} />}
              </div>
            )}

            {mostrarForm && (
              <div className="form-card">
                <form onSubmit={onSave}>
                  <h3 style={{ marginBottom: '20px', color: 'var(--muted)' }}>
                    {editando ? 'Editar registro' : 'Nuevo registro'}
                  </h3>
                  <div className="form-grid">
                    {Object.keys(form).map(key => {
                      if (['id','vehiculo','empleado','cliente','presupuesto','citas','presupuestos','facturas','piezas'].includes(key)) return null
                      if (key === 'vehiculoId') return (
                        <div className="field" key={key}>
                          <label>Vehículo</label>
                          <select value={form.vehiculoId || ''} onChange={e => setForm(prev => ({ ...prev, vehiculoId: e.target.value }))}>
                            <option value="">Seleccionar vehículo</option>
                            {vehiculos.map(v => <option key={v.id} value={v.id}>{v.matricula} - {v.marca} {v.modelo}</option>)}
                          </select>
                        </div>
                      )
                      if (key === 'empleadoId') return (
                        <div className="field" key={key}>
                          <label>Empleado</label>
                          <select value={form.empleadoId || ''} onChange={e => setForm(prev => ({ ...prev, empleadoId: e.target.value }))}>
                            <option value="">Seleccionar empleado</option>
                            {empleados.map(e => <option key={e.id} value={e.id}>{e.nombre} ({e.puesto || 'Sin puesto'})</option>)}
                          </select>
                        </div>
                      )
                      if (key === 'clienteId') return (
                        <div className="field" key={key}>
                          <label>Cliente</label>
                          <select value={form.clienteId || ''} onChange={e => setForm(prev => ({ ...prev, clienteId: e.target.value }))}>
                            <option value="">Seleccionar cliente</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.apellidos} ({c.dni})</option>)}
                          </select>
                        </div>
                      )
                      if (key === 'presupuestoId') return (
                        <div className="field" key={key}>
                          <label>Presupuesto</label>
                          <select value={form.presupuestoId || ''} onChange={e => setForm(prev => ({ ...prev, presupuestoId: e.target.value }))}>
                            <option value="">Seleccionar presupuesto</option>
                            {presupuestos.map(p => <option key={p.id} value={p.id}>#{p.id} - {p.total}€ ({p.estado})</option>)}
                          </select>
                        </div>
                      )
                      if (key === 'estado') return (
                        <div className="field" key={key}>
                          <label>Estado</label>
                          <select value={form.estado || ''} onChange={e => setForm(prev => ({ ...prev, estado: e.target.value }))}>
                            {tab === 'citas'        && ['PENDIENTE','CONFIRMADA','CANCELADA','COMPLETADA'].map(s => <option key={s} value={s}>{s}</option>)}
                            {tab === 'presupuestos' && ['PENDIENTE','ACEPTADO','RECHAZADO'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      )
                      if (key === 'rol' && tab === 'empleados') return (
                        <div className="field" key={key}>
                          <label>Rol</label>
                          <select value={form.rol || 'EMPLEADO'} onChange={e => setForm(prev => ({ ...prev, rol: e.target.value }))}>
                            <option value="EMPLEADO">EMPLEADO</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>
                      )
                      return (
                        <div className="field" key={key}>
                          <label>{key}</label>
                          <input
                            key={`${tab}-${editando?.id || 'new'}-${key}`}
                            type={
                              key === 'contrasena' ? 'password' :
                              key === 'fecha'      ? 'date'     :
                              key === 'hora'       ? 'time'     :
                              key === 'anio' || key === 'total' || key === 'precio' || key === 'stock' ? 'number' :
                              'text'
                            }
                            value={form[key] || ''}
                            onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                          />
                        </div>
                      )
                    })}
                  </div>
                  <div className="form-actions">
                    <button className="login-btn" type="submit">Guardar</button>
                    <button type="button" className="btn-cancel" onClick={() => { setMostrarForm(false); setEditando(null); setForm({}) }}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App