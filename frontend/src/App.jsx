import { useState, useEffect } from 'react'
import axios from 'axios'
import './assets/App.css'

import Vehiculos from './components/Vehiculos'
import Clientes from './components/Clientes'
import Empleados from './components/Empleados'
import Citas from './components/Citas'
import Presupuestos from './components/Presupuestos'
import Facturas from './components/Facturas'
import Piezas from './components/Piezas'

function App() {
  // --- ESTADOS ---
  const [session, setSession] = useState({ logged: false, role: '', auth: { email: '', pass: '' } })
  const [view, setView] = useState('login')
  const [tab, setTab] = useState('vehiculos')
  const [data, setData] = useState([])
  const [form, setForm] = useState({})
  const [editItem, setEditItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [msg, setMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  // Auxiliares para selects
  const [vehiculos, setVehiculos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [clientes, setClientes] = useState([])
  const [presupuestos, setPresupuestos] = useState([])
  const [piezas, setPiezas] = useState([])

  const [regForm, setRegForm] = useState({ nombre: '', apellidos: '', dni: '', email: '', telefono: '', direccion: '', contrasena: '' })

  // --- FUNCIONES AUXILIARES ---
  const api = () => ({
    headers: { Authorization: `Basic ${btoa(session.auth.email + ':' + session.auth.pass)}` }
  })

  const notify = (text, type = 'ok') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  // --- LOGIN ---
  const handleLogin = (e) => {
    e.preventDefault()
    const cfg = api()
    axios.get('/api/empleados', cfg)
      .then(() => {
        axios.get('/api/empleados', cfg).then(res => {
          const match = res.data.find(em => em.email === session.auth.email)
          const role = match?.rol === 'ADMIN' || session.auth.email === 'admin@wo.com' ? 'ADMIN' : 'EMPLEADO'
          setSession(s => ({ ...s, logged: true, role }))
          navigateTo('vehiculos', cfg)
        })
      })
      .catch(() => {
        axios.get('/api/clientes', cfg)
          .then(res => {
            const match = res.data.find(c => c.email === session.auth.email)
            if (match) {
              setSession(s => ({ ...s, logged: true, role: 'CLIENTE', clienteId: match.id }))
              setData([match])
              setTab('miPerfil')
            } else {
              notify('Credenciales incorrectas', 'err')
            }
          })
          .catch(() => notify('Credenciales incorrectas', 'err'))
      })
  }

  // --- REGISTRO ---
 const handleRegister = (e) => {
  e.preventDefault()
  axios.post('/api/clientes', regForm)
    .then(() => {
      notify('Cuenta creada. Ya puedes iniciar sesión.', 'ok')
      setView('login')
    })
    .catch(err => {
      // Extrae el mensaje del backend si existe
      const backendMsg = err.response?.data?.message
 

      // Si el backend no da mensaje, muestra uno genérico
      if (backendMsg) {
        notify(backendMsg, 'err')
      } else if (err.response?.status === 409) {
        // Ejemplo: conflicto por duplicado
        notify('El DNI o email ya existe en el sistema.', 'err')
      } else if (err.response?.status === 400) {
        notify('Datos inválidos. Revisa los campos.', 'err')
      } else {
        // Otros errores
        notify('Error inesperado al registrar. Intenta de nuevo.', 'err')
      }
    })
}

  // --- CARGA DE DATOS AUXILIARES ---
  const loadAux = (cfg) => {
    axios.get('/api/vehiculos', cfg).then(r => setVehiculos(r.data)).catch(() => {})
    axios.get('/api/empleados', cfg).then(r => setEmpleados(r.data)).catch(() => {})
    axios.get('/api/clientes', cfg).then(r => setClientes(r.data)).catch(() => {})
    axios.get('/api/presupuestos', cfg).then(r => setPresupuestos(r.data)).catch(() => {})
    axios.get('/api/piezas', cfg).then(r => setPiezas(r.data)).catch(() => {})
  }

  // --- NAVEGACIÓN ENTRE TABS ---
  const navigateTo = (newTab, cfg) => {
    setTab(newTab)
    setForm({})
    setEditItem(null)
    setShowForm(false)
    const config = cfg || api()
    setLoading(true)

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

  // --- CRUD ---
  const onSave = (e) => {
    e.preventDefault()
    const config = api()
    const endpoint = tab

    const buildBody = () => {
      const f = { ...form }
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

  const onDelete = (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return
    axios.delete(`/api/${tab}/${id}`, api())
      .then(() => { notify('Eliminado'); navigateTo(tab) })
      .catch(() => notify('Error al eliminar', 'err'))
  }

  const onEdit = (item) => {
    setEditItem(item)
    setForm({ ...item })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- LOGIN/REGISTRO ---
  if (!session.logged) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-logo">W<span>&amp;</span>O</div>
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
                {['nombre','apellidos','dni','email','telefono','direccion'].map(k => (
                  <div className="field" key={k}>
                    <label>{k.charAt(0).toUpperCase() + k.slice(1)}</label>
                    <input
                      placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                      value={regForm[k]}
                      onChange={e => setRegForm(r => ({...r,[k]:e.target.value}))}
                      required={['nombre','dni','email'].includes(k)}
                    />
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

  // --- RENDER PRINCIPAL ---
  return (
    <div className="app-layout">
      {/* Aquí puedes poner Sidebar, Header, etc. */}
      <main className="main-content">
        {msg && <div className={`toast toast-${msg.type}`}>{msg.text}</div>}
        <div className="table-card">
          {tab === 'vehiculos' && (
            <Vehiculos data={data} onEdit={onEdit} onDelete={onDelete} />
          )}
          {tab === 'clientes' && (
            <Clientes data={data} onEdit={onEdit} onDelete={onDelete} />
          )}
          {tab === 'empleados' && (
            <Empleados data={data} onEdit={onEdit} onDelete={onDelete} />
          )}
          {tab === 'citas' && (
            <Citas data={data} onEdit={onEdit} onDelete={onDelete} />
          )}
          {tab === 'presupuestos' && (
            <Presupuestos data={data} onEdit={onEdit} onDelete={onDelete} />
          )}
          {tab === 'facturas' && (
            <Facturas data={data} onEdit={onEdit} onDelete={onDelete} />
          )}
          {tab === 'piezas' && (
            <Piezas data={data} onEdit={onEdit} onDelete={onDelete} />
          )}
        </div>
      </main>
    </div>
  )
}

export default App;