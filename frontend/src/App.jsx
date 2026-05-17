import { useState, useEffect, use } from 'react'
import axios from 'axios'

import './assets/App.css'

import Vehiculos from './components/Vehiculos'
import Clientes from './components/Clientes'
import Empleados from './components/Empleados'
import Citas from './components/Citas'
import Presupuestos from './components/Presupuestos'
import Facturas from './components/Facturas'
import Piezas from './components/Piezas'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Modal from './components/Modal'
import Buscador from './components/Buscador'
import ClienteView from './components/ClienteView'
import CalendarioCitas from './components/CalendarioCitas'

function App() {

  // =========================================
  // SESIÓN PERSISTENTE
  // =========================================
  const [view, setView] = useState('login')

  const [sesion, setSesion] = useState(() => {
    const saved = sessionStorage.getItem('sesion')

    return saved ? JSON.parse(saved) : {
      logueado: false,
      rol: '',
      nombre: '',
      clienteId: null,
      auth: {
        email: '',
        pass: ''
      }
    }
  })

  useEffect(() => {
    sessionStorage.setItem('sesion', JSON.stringify(sesion))
  }, [sesion])

  // =========================================
  // ESTADOS PRINCIPALES
  // =========================================
  const [tab, setTab] = useState('')
  const [data, setData] = useState([])
  const [search, setSearch] = useState('')

  const [mostrarForm, setMostrarForm] = useState(false)

  const [editando, setEditando] = useState(null)

  const [toast, setToast] = useState(null)

  const [modalEliminar, setModalEliminar] = useState({
    open: false,
    id: null
  })

  // =========================================
  // DATOS AUXILIARES
  // =========================================
  const [vehiculos, setVehiculos] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [clientes, setClientes] = useState([])
  const [presupuestos, setPresupuestos] = useState([])

  // =========================================
  // FORMULARIO CONTROLADO
  // =========================================
  const [form, setForm] = useState({})

  // =========================================
  // CLIENTE DASHBOARD
  // =========================================
  const [vehiculosCliente, setVehiculosCliente] = useState([])
  const [citasCliente, setCitasCliente] = useState([])
  const [presupuestosCliente, setPresupuestosCliente] = useState([])
  const [facturasCliente, setFacturasCliente] = useState([])
  const [calendarioCitas, setCalendarioCitas] = useState("tabla") // o "calendario"
  const rol = sesion?.rol?.toUpperCase()

  useEffect(() => {

    if (rol === 'CLIENTE') {
      setTab('dashboard')
    }

  }, [rol,sesion.logueado])

  // =========================================
  // TOAST
  // =========================================
  const notify = (text, type = 'ok') => {

    setToast({
      text,
      type
    })

    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  // =========================================
  // AUTH CONFIG
  // =========================================
  const authConfig = () => ({
    headers: {
      Authorization:
        `Basic ${btoa(sesion.auth.email + ':' + sesion.auth.pass)}`
    }
  })

  // =========================================
  // CARGAR DATOS
  // =========================================
  useEffect(() => {

    if (!sesion.logueado) return

    if (rol === 'CLIENTE') {

      axios.get('/api/vehiculos', authConfig())
        .then(res => {
          const filtrados =
            res.data.filter(v =>
              v?.cliente?.id === sesion.clienteId
            )

          setVehiculosCliente(filtrados)
        })

      axios.get('/api/citas', authConfig())
        .then(res => {

          const filtradas =
            res.data.filter(c =>
              c?.vehiculo?.cliente?.id === sesion.clienteId
            )

          setCitasCliente(filtradas)
        })

      axios.get('/api/presupuestos', authConfig())
        .then(res => {

          const filtrados =
            res.data.filter(p =>
              p?.cliente?.id === sesion.clienteId
            )

          setPresupuestosCliente(filtrados)
        })

      axios.get('/api/facturas', authConfig())
        .then(res => {

          const filtradas =
            res.data.filter(f =>
              f?.cliente?.id === sesion.clienteId
            )

          setFacturasCliente(filtradas)
        })

      return
    }

    axios.get(`/api/${tab}`, authConfig())
      .then(res => setData(res.data))
      .catch(() => setData([]))

    // AUX
    axios.get('/api/vehiculos', authConfig())
      .then(res => setVehiculos(res.data))

    axios.get('/api/empleados', authConfig())
      .then(res => setEmpleados(res.data))

    axios.get('/api/clientes', authConfig())
      .then(res => setClientes(res.data))

    axios.get('/api/presupuestos', authConfig())
      .then(res => setPresupuestos(res.data))

  }, [tab, sesion])

  // =========================================
  // VALIDACIONES
  // =========================================
  const validarEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validarDni = (dni) => {
    return /^[0-9]{8}[A-Za-z]$/.test(dni)
  }

  const validarMatricula = (m) => {
    return /^[0-9]{4}[A-Z]{3}$/.test(m)
  }

  // =========================================
  // LOGIN
  // =========================================
  const handleLogin = (e) => {

    e.preventDefault()

    const email = e.target.email.value
    const pass = e.target.password.value

    const cfg = {
      headers: {
        Authorization:
          `Basic ${btoa(email + ':' + pass)}`
      }
    }

    axios.get('/api/empleados', cfg)

      .then(res => {

        const emp =
          res.data.find(u => u.email === email)

        if (!emp) return

        setSesion({
          logueado: true,
          rol: emp.rol,
          nombre: emp.nombre,
          auth: { email, pass }
        })

        notify('Te damos la bienvenida a W&O Autogroup, ' + emp.nombre)
        setTab("")
      })

      .catch(() => {

        axios.get('/api/clientes', cfg)

          .then(res => {

            const cli =
              res.data.find(c => c.email === email)

            if (!cli) {
              notify('Credenciales incorrectas', 'err')
              return
            }

            setSesion({
              logueado: true,
              rol: 'CLIENTE',
              nombre: cli.nombre,
              clienteId: cli.id,
              auth: { email, pass }
            })

            notify('Te damos la bienvenida a W&O Autogroup, ' + cli.nombre)
            setTab("")
          })

          .catch(() => {
            notify('Credenciales incorrectas', 'err')
          })
      })
  }

  // =========================================
  // REGISTRO
  // =========================================
  const handleRegister = (e) => {

    e.preventDefault()

    const body = {
      nombre: e.target.nombre.value,
      apellidos: e.target.apellidos.value,
      dni: e.target.dni.value,
      email: e.target.email.value,
      telefono: e.target.telefono.value,
      direccion: e.target.direccion.value,
      contrasena: e.target.password.value
    }

    if (!validarEmail(body.email)) {
      notify('Email inválido', 'err')
      return
    }

    if (!validarDni(body.dni)) {
      notify('DNI inválido', 'err')
      return
    }

    axios.post('/api/clientes', body)

      .then(() => {

        notify('Cuenta creada')

        setView('login')
      })

      .catch(() => {
        notify('Error al registrar', 'err')
      })
  }


  // =========================================
  //PLANTILLA FORMULARIO
  // =========================================

  const emptyFormByTab=(t,rollUpper)=>{
    //CLIENTE: Solo permitimos crear citas y vehiculos desde el dashboard, el resto de entidades las gestiona el empleado
    if(rollUpper==="CLIENTE"){
      if(t==="citas"){
        return {
          fecha: '',
          hora: '',
          descripcion: '',
          estado: 'PENDIENTE',
          vehiculoId: '',
        }
      }
      if(t==="vehiculos"){
        return {
          matricula: '',
          marca: '',
          modelo: '',
          anio: '',
        }
      }
      return {}
    }
  }

  // =========================================
  // EDITAR
  // =========================================
  const onEdit = (item) => {

    setEditando(item)

    // PRECARGA SELECTS CITA
    if (tab === 'citas') {

      setForm({
        ...item,
        vehiculoId: item?.vehiculo?.id || '',
        empleadoId: item?.empleado?.id || ''
      })

    } else {

      setForm(item)
    }

    setMostrarForm(true)
  }

  // =========================================
  // DELETE
  // =========================================
  const onDelete = (id) => {

    setModalEliminar({
      open: true,
      id
    })
  }

  const confirmarEliminar = () => {

    axios.delete(
      `/api/${tab}/${modalEliminar.id}`,
      authConfig()
    )

      .then(() => {

        setData(prev =>
          prev.filter(i => i.id !== modalEliminar.id)
        )

        notify('Registro eliminado')

        setModalEliminar({
          open: false,
          id: null
        })
      })

      .catch(() => {
        notify('Error al eliminar', 'err')
      })
  }

  // =========================================
  // SAVE
  // =========================================
  const onSave = (e) => {
  e.preventDefault()
 

  if (form.email && !validarEmail(form.email)) {
    notify('Email inválido', 'err')
    return
  }
 

  if (form.dni && !validarDni(form.dni)) {
    notify('DNI inválido', 'err')
    return
  }
 

  if (form.matricula && !validarMatricula(form.matricula)) {
    notify('Matrícula inválida', 'err')
    return
  }
 

  const body = { ...form }
  console.log("BODY ANTES DE REGLAS EXTRA:", body)
 

  // ==========================
  // REGLAS EXTRA CLIENTE
  // ==========================
  if (rol === 'CLIENTE') {
 

    // Vehículo: asignar SIEMPRE el cliente logueado
    if (tab === 'vehiculos') {
      body.cliente = { id: sesion.clienteId }
    }
 

    // Cita: validar que el vehiculo es suyo
    if (tab === 'citas') {
      const vehiculoSeleccionado = parseInt(body.vehiculoId || '0')
      const esVehiculoValido = vehiculosCliente.some(v => v.id === vehiculoSeleccionado)
 

      if (!esVehiculoValido) {
        notify('Debes seleccionar uno de tus vehículos', 'err')
        return
      }
 

      if (!body.estado) body.estado = 'PENDIENTE'
    }
    body.cliente = { id: sesion.clienteId }
    body.empleado={
      id: 1 // asignamos un empleado por defecto, ya que el cliente no puede elegirlo ni verlo  
    }
  }
 

  // ==========================
  // CONVERTIR IDs A OBJETOS
  // ==========================
  if (body.vehiculoId) {
    body.vehiculo = { id: parseInt(body.vehiculoId) }
    delete body.vehiculoId
  }
 

  if (body.empleadoId) {
    body.empleado = { id: parseInt(body.empleadoId) }
    delete body.empleadoId
  }
 

  if (body.clienteId) {
    body.cliente = { id: parseInt(body.clienteId) }
    delete body.clienteId
  }
 

  if (body.presupuestoId) {
    body.presupuesto = { id: parseInt(body.presupuestoId) }
    delete body.presupuestoId
  }
 

  // ==========================
  // REQUEST (FUERA DEL IF)
  // ==========================
  const req = editando
    ? axios.put(`/api/${tab}/${editando.id}`, body, authConfig())
    : axios.post(`/api/${tab}`, body, authConfig())
 

  req.then(() => {
 

    notify(editando ? 'Actualizado correctamente' : 'Creado correctamente')
 

    setMostrarForm(false)
    setEditando(null)
    setForm({})
 

    // refresco según rol
    if (rol === 'CLIENTE') {
      if (tab === 'vehiculos') {
        axios.get('/api/vehiculos', authConfig())
          .then(res => {
            const filtrados = res.data.filter(v => v?.cliente?.id === sesion.clienteId)
            setVehiculosCliente(filtrados)
          })
      }
 

      if (tab === 'citas') {
        axios.get('/api/citas', authConfig())
          .then(res => {
            const filtradas = res.data.filter(c => c?.vehiculo?.cliente?.id === sesion.clienteId)
            setCitasCliente(filtradas)
          })
      }
 

      return
    }
 

    axios.get(`/api/${tab}`, authConfig())
      .then(res => setData(res.data))
 

  }).catch((err) => {
    console.error(err)
    notify('Error al guardar', 'err')
  })
}
  // =========================================
  // LOGOUT
  // =========================================
  const logout = () => {

    sessionStorage.removeItem('sesion')

    setSesion({
      logueado: false,
      rol: '',
      nombre: '',
      clienteId: null,
      auth: {
        email: '',
        pass: ''
      }
    })
  }

  // =========================================
  // LOGIN UI
  // =========================================
  if (!sesion.logueado) {

    return (

      <div className="auth-wrapper">

        <div className="auth-card">

          <div className="auth-logo">
            W<span>&O</span>
          </div>

          <p className="auth-sub">
            Plataforma de Gestión del Taller
          </p>

          {view === 'login' ? (

            <>
              <h2 className="auth-title">
                Acceder al sistema
              </h2>

              <form onSubmit={handleLogin}>

                <div className="field">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    required
                  />
                </div>

                <div className="field">
                  <label>Contraseña</label>

                  <input
                    type="password"
                    name="password"
                    required
                  />
                </div>

                <button className="login-btn">
                  Acceder
                </button>

                <p className="auth-switch">
                  ¿No tienes cuenta?

                  <span onClick={() => setView('register')}>
                    Crear cuenta
                  </span>
                </p>

              </form>
            </>

          ) : (

            <>
              <h2 className="auth-title">
                Crear cuenta
              </h2>

              <form onSubmit={handleRegister}>

                <div className="field">
                  <label>Nombre</label>
                  <input type="text" name="nombre" required />
                </div>

                <div className="field">
                  <label>Apellidos</label>
                  <input type="text" name="apellidos" />
                </div>

                <div className="field">
                  <label>DNI</label>
                  <input type="text" name="dni" required />
                </div>

                <div className="field">
                  <label>Email</label>
                  <input type="email" name="email" required />
                </div>

                <div className="field">
                  <label>Teléfono</label>
                  <input type="text" name="telefono" />
                </div>

                <div className="field">
                  <label>Dirección</label>
                  <input type="text" name="direccion" />
                </div>

                <div className="field">
                  <label>Contraseña</label>
                  <input type="password" name="password" required />
                </div>

                <button className="login-btn">
                  Registrarme
                </button>

                <p className="auth-switch">
                  ¿Ya tienes cuenta?

                  <span onClick={() => setView('login')}>
                    Volver
                  </span>
                </p>

              </form>
            </>
          )}
        </div>

        {toast &&
          <div className={`toast toast-${toast.type}`}>
            {toast.text}
          </div>
        }
      </div>
    )
  }

  // =========================================
  // MAIN APP
  // =========================================
  return (

    <div className="app-layout">

      <Sidebar
        session={sesion}
        tab={tab}
        setTab={setTab}
        logout={logout}
      />

      <main className="contenido-principal">

        {toast &&
          <div className={`toast toast-${toast.type}`}>
            {toast.text}
          </div>
        }

        {rol === 'CLIENTE' ? (

          <>

            {(tab === "vehiculos" || tab === "citas") ? (
              <>
                <Header
                  title={tab === "vehiculos" ? "Mis Vehículos" : "Mis Citas"}
                  onNew={() => {
                    console.log("CLICK NUEVO")
                    setMostrarForm(true)
                    setEditando(null)
                    setForm(emptyFormByTab(tab,rol))
                  }}
              />
              <Buscador
                value={search}
                onChange={setSearch}    
              />
              <div className="tabla-card">
                {tab === "vehiculos" && (
                  <Vehiculos
                    data={vehiculosCliente}
                    search={search}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                )}
                {tab === "citas" &&(
                  <div className="form-actions">
                    <button 
                    className={`login-btn ${calendarioCitas==="tabla" ? "active" : ""}`}
                    onClick={() => setCalendarioCitas("tabla")}>
                      Lista
                    </button>
                    <button 
                    className={`login-btn ${calendarioCitas==="calendario" ? "active" : ""}`}
                    onClick={() => setCalendarioCitas("calendario")}>
                      Calendario
                    </button>
                  </div>
                )}
                {calendarioCitas === "tabla" ? (
                  <Citas
                    data={citasCliente}
                    search={search}   
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ) : (
                  <CalendarioCitas citas={citasCliente} />
                )} 

              </div>

              {/*FORMULARIO*/}
              {mostrarForm && (
                <div className="form-card">
                  <form onSubmit={onSave}>
                    <div className="form-grid">
                      {Object.keys(form).map(key => {
                        if (key === 'id') return null
                        return (
                          <div className="field" key={key}>
                            <label>{key}</label>
                            <input
                              value={form[key] || ''}
                              onChange={e => setForm(prev => ({
                                ...prev,
                                [key]: e.target.value
                              }))}
                            />
                          </div>
                        )
                      })}

                      {tab === 'citas' && (
                        <>
                          <div className="field">
                            <label>Vehículos</label>
                            <select
                              value={form.vehiculoId || ''}
                              onChange={e => setForm(prev => ({
                                ...prev,
                                vehiculoId: e.target.value
                              }))}
                            >
                              <option value="">Selecciona un vehículo</option>
                              {vehiculosCliente.map(vehiculo => (
                                <option key={vehiculo.id} value={vehiculo.id}>
                                  {vehiculo.marca} {vehiculo.modelo}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}

                    </div>
                    <div className="form-actions">
                      <button className='login-btn' 

                      type="submit">
                        Guardar
                      </button>
                      
                    <button type="button" className="btn-cancel" onClick={() => setMostrarForm(false)}>
                      Cancelar
                    </button>
                    </div>
                  </form>
                </div>
              )}
              </>
            ) : (

              <ClienteView
              tab={tab}
              cliente={sesion}
              vehiculos={vehiculosCliente}
              citas={citasCliente}
              presupuestos={presupuestosCliente}
              facturas={facturasCliente}
            />
            )}

          </>

        ) : (

          <>
            <Header
              title={`Gestión de ${tab}`}
              onNew={() => {
                setMostrarForm(true)
                setEditando(null)
                setForm(emptyFormByTab(tab,rol))
              }}
            />

            <Buscador
              value={search}
              onChange={setSearch}
            />

            <div className="tabla-card">

              {tab === 'vehiculos' &&
                <Vehiculos
                  data={data}
                  search={search}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              }

              {tab === 'clientes' &&
                <Clientes
                  data={data}
                  search={search}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              }

              {tab === 'empleados' && rol === 'ADMIN' &&
                <Empleados
                  data={data}
                  search={search}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              }

              {tab === 'citas' &&
                <Citas
                  data={data}
                  search={search}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              }

              {tab === 'presupuestos' &&
                <Presupuestos
                  data={data}
                  search={search}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              }

              {tab === 'facturas' &&
                <Facturas
                  data={data}
                  search={search}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              }

              {tab === 'piezas' &&
                <Piezas
                  data={data}
                  search={search}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              }

            </div>

            {mostrarForm && (

              <div className="form-card">

                <form onSubmit={onSave}>

                  <div className="form-grid">

                    {Object.keys(form).map(key => {

                      if (key === 'id') return null

                      return (
                        <div className="field" key={key}>

                          <label>{key}</label>

                          <input
                            value={form[key] || ''}
                            onChange={(e) =>
                              setForm(prev => ({
                                ...prev,
                                [key]: e.target.value
                              }))
                            }
                          />

                        </div>
                      )
                    })}

                    {tab === 'citas' && (

                      <>
                        <div className="field">
                          <label>Vehículo</label>

                          <select
                            value={form.vehiculoId || ''}
                            onChange={(e) =>
                              setForm(prev => ({
                                ...prev,
                                vehiculoId: e.target.value
                              }))
                            }
                          >
                            <option value="">
                              Selecciona vehículo
                            </option>

                            {(rol === 'CLIENTE' ? vehiculosCliente : vehiculos).map(v => (
                              <option key={v.id} value={v.id}>
                                {v.matricula}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="field">
                          <label>Empleado</label>

                          <select
                            value={form.empleadoId || ''}
                            onChange={(e) =>
                              setForm(prev => ({
                                ...prev,
                                empleadoId: e.target.value
                              }))
                            }
                          >
                            <option value="">
                              Selecciona empleado
                            </option>

                            {empleados.map(emp => (
                              <option key={emp.id} value={emp.id}>
                                {emp.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                  </div>

                  <div className="form-actions">

                    <button className="login-btn">
                      Guardar
                    </button>

                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setMostrarForm(false)}
                    >
                      Cancelar
                    </button>

                  </div>

                </form>
              </div>
            )}
          </>
        )}
      </main>

      <Modal
        open={modalEliminar.open}
        title="Eliminar"
        text="¿Seguro que deseas eliminar este registro?"
        onConfirm={confirmarEliminar}
        onCancel={() =>
          setModalEliminar({
            open: false,
            id: null
          })
        }
      />

    </div>
  )
}

export default App
