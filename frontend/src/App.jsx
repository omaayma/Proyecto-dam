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

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Modal from './components/Modal'
import Buscador from './components/Buscador'
import ClienteView from './components/ClienteView'



axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

function App() {

  // =========================
  // SESIÓN
  // =========================

  const [sesion, setSesion] = useState(() => {
    const guardada = sessionStorage.getItem('sesion')
    return guardada ? JSON.parse(guardada) : {
      logueado: false,
      rol: '',
      auth: { email: '', pass: '' },
      clienteId: null
    }
  })

  useEffect(() => {
    sessionStorage.setItem('sesion', JSON.stringify(sesion))
  }, [sesion])

  // =========================
  // VISTA
  // FIX: antes siempre arrancaba en 'login' aunque hubiera sesión activa,
  // por eso al recargar parecía que se cerraba la sesión
  // =========================

  const [vista, setVista] = useState(() => {
    const guardada = sessionStorage.getItem('sesion')
    if (guardada) {
      const s = JSON.parse(guardada)
      if (s.logueado) return 'app'
    }
    return 'login'
  })

  const [pestaña, setPestaña]       = useState('vehiculos')
  const [datos, setDatos]           = useState([])
  const [filtrados, setFiltrados]   = useState([])
  const [cargando, setCargando]     = useState(false)
  const [mensaje, setMensaje]       = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [itemEditar, setItemEditar] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [idEliminar, setIdEliminar] = useState(null)

  // =========================
  // DATOS AUXILIARES
  // =========================

  const [vehiculos,    setVehiculos]    = useState([])
  const [clientes,     setClientes]     = useState([])
  const [empleados,    setEmpleados]    = useState([])
  const [presupuestos, setPresupuestos] = useState([])
  const [citasCliente, setCitasCliente] = useState([])

  // =========================
  // FORMULARIO
  // =========================

  const [form, setForm] = useState({})

  const [formRegistro, setFormRegistro] = useState({
    nombre: '', apellidos: '', dni: '', email: '',
    telefono: '', direccion: '', contrasena: ''
  })

  // =========================
  // CONFIGURACIÓN API
  // =========================

  const api = () => ({
    headers: {
      Authorization: `Basic ${btoa(sesion.auth.email + ':' + sesion.auth.pass)}`
    }
  })

  // =========================
  // NOTIFICACIONES
  // =========================

  const notificar = (texto, tipo = 'ok') => {
    setMensaje({ texto, tipo })
    setTimeout(() => setMensaje(null), 3500)
  }

  // =========================
  // VALIDACIONES
  // FIX: antes se llamaba validarDni (no existía) y el registro no funcionaba
  // =========================

  const validarDniNie = (doc) => /^[XYZ0-9][0-9]{7}[A-Za-z]$/.test(doc)
  const validarMatricula = (m) => /^[0-9]{4}[A-Z]{3}$/.test(m)
  const validarEmail = (e) => /\S+@\S+\.\S+/.test(e)

  // =========================
  // CARGAR DATOS AUXILIARES
  // =========================

  const cargarAuxiliares = (cfg) => {
    axios.get('/api/vehiculos',    cfg).then(r => setVehiculos(r.data)).catch(() => {})
    axios.get('/api/clientes',     cfg).then(r => setClientes(r.data)).catch(() => {})
    axios.get('/api/empleados',    cfg).then(r => setEmpleados(r.data)).catch(() => {})
    axios.get('/api/presupuestos', cfg).then(r => setPresupuestos(r.data)).catch(() => {})
  }

  // =========================
  // RECARGA DE PÁGINA
  // FIX: si ya hay sesión guardada se recargan los datos automáticamente
  // =========================

  useEffect(() => {
    if (!sesion.logueado) return

    if (sesion.rol !== 'CLIENTE') {
      navegarA(pestaña, api())
    } else {
      const cfg = api()
      axios.get('/api/clientes', cfg).then(res => {
        const encontrado = res.data.find(c => c.id === sesion.clienteId)
        if (!encontrado) return
        setDatos([encontrado])
        axios.get('/api/citas', cfg).then(r => {
          setCitasCliente(r.data.filter(c => c.vehiculo?.cliente?.id === encontrado.id))
        }).catch(() => {})
        axios.get('/api/vehiculos', cfg).then(r => {
          setVehiculos(r.data.filter(v => v.cliente?.id === encontrado.id))
        }).catch(() => {})
      }).catch(() => {})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // =========================
  // LOGIN
  // =========================

  const handleLogin = (e) => {
    e.preventDefault()
    const cfg = api()

    axios.get('/api/empleados', cfg)
      .then(res => {
        const encontrado = res.data.find(emp => emp.email === sesion.auth.email)
        if (!encontrado) { notificar('Credenciales incorrectas', 'err'); return }

        const rol = encontrado.rol === 'ADMIN' ? 'ADMIN' : 'EMPLEADO'
        const ns  = { ...sesion, logueado: true, rol }
        setSesion(ns)
        sessionStorage.setItem('sesion', JSON.stringify(ns))
        setVista('app')
        navegarA('vehiculos', cfg)
      })
      .catch(() => {
        axios.get('/api/clientes', cfg)
          .then(res => {
            const encontrado = res.data.find(c => c.email === sesion.auth.email)
            if (!encontrado) { notificar('Credenciales incorrectas', 'err'); return }

            const ns = { ...sesion, logueado: true, rol: 'CLIENTE', clienteId: encontrado.id }
            setSesion(ns)
            sessionStorage.setItem('sesion', JSON.stringify(ns))
            setDatos([encontrado])

            axios.get('/api/citas', cfg).then(r => {
              setCitasCliente(r.data.filter(c => c.vehiculo?.cliente?.id === encontrado.id))
            }).catch(() => {})
            axios.get('/api/vehiculos', cfg).then(r => {
              setVehiculos(r.data.filter(v => v.cliente?.id === encontrado.id))
            }).catch(() => {})

            setVista('app')
            setPestaña('cliente')
          })
          .catch(() => notificar('Credenciales incorrectas', 'err'))
      })
  }

  // =========================
  // REGISTRO
  // FIX: el botón Registrarme no hacía nada porque llamaba a validarDni
  // (función inexistente) → corregido a validarDniNie
  // =========================

  const handleRegistro = (e) => {
    e.preventDefault()

    if (!validarDniNie(formRegistro.dni)) {
      notificar('DNI/NIE inválido — formato: letra o número + 7 dígitos + letra', 'err')
      return
    }
    if (!validarEmail(formRegistro.email)) {
      notificar('Email inválido', 'err')
      return
    }

    axios.post('/api/clientes', formRegistro)
      .then(() => {
        notificar('Cuenta creada. Ya puedes iniciar sesión.')
        setVista('login')
        setFormRegistro({ nombre: '', apellidos: '', dni: '', email: '', telefono: '', direccion: '', contrasena: '' })
      })
      .catch(err => {
        if (err.response?.status === 409 || err.response?.status === 400) {
          notificar('El DNI/NIE o email ya están registrados', 'err')
        } else {
          notificar('Error al registrar. Inténtalo de nuevo.', 'err')
        }
      })
  }

  // =========================
  // NAVEGACIÓN
  // =========================

  const navegarA = (nuevaPestaña, cfg) => {
    setPestaña(nuevaPestaña)
    setMostrarForm(false)
    setItemEditar(null)
    setCargando(true)

    const mapaEndpoints = {
      vehiculos: 'vehiculos', clientes: 'clientes', empleados: 'empleados',
      citas: 'citas', presupuestos: 'presupuestos', facturas: 'facturas', piezas: 'piezas'
    }

    const endpoint = mapaEndpoints[nuevaPestaña]
    if (!endpoint) { setCargando(false); return }

    axios.get(`/api/${endpoint}`, cfg || api())
      .then(r => { setDatos(r.data); setFiltrados(r.data); cargarAuxiliares(cfg || api()) })
      .catch(() => setDatos([]))
      .finally(() => setCargando(false))
  }

  // =========================
  // BÚSQUEDA
  // =========================

  const handleBusqueda = (valor) => {
    const v = valor.toLowerCase()
    setFiltrados(datos.filter(item => JSON.stringify(item).toLowerCase().includes(v)))
  }

  // =========================
  // GUARDAR
  // =========================

  const guardar = (e) => {
    e.preventDefault()

    if (form.dni       && !validarDniNie(form.dni))         { notificar('DNI/NIE inválido', 'err'); return }
    if (form.email     && !validarEmail(form.email))         { notificar('Email inválido', 'err'); return }
    if (form.matricula && !validarMatricula(form.matricula)) { notificar('Matrícula inválida — 4 números + 3 letras mayúsculas', 'err'); return }

    const cuerpo = { ...form }
    if (cuerpo.vehiculoId)    { cuerpo.vehiculo    = { id: parseInt(cuerpo.vehiculoId) };    delete cuerpo.vehiculoId }
    if (cuerpo.empleadoId)    { cuerpo.empleado    = { id: parseInt(cuerpo.empleadoId) };    delete cuerpo.empleadoId }
    if (cuerpo.clienteId)     { cuerpo.cliente     = { id: parseInt(cuerpo.clienteId) };     delete cuerpo.clienteId }
    if (cuerpo.presupuestoId) { cuerpo.presupuesto = { id: parseInt(cuerpo.presupuestoId) }; delete cuerpo.presupuestoId }

    const peticion = itemEditar
      ? axios.put(`/api/${pestaña}/${itemEditar.id}`, cuerpo, api())
      : axios.post(`/api/${pestaña}`, cuerpo, api())

    peticion
      .then(() => { notificar(itemEditar ? 'Actualizado correctamente' : 'Creado correctamente'); setMostrarForm(false); navegarA(pestaña) })
      .catch(() => notificar('Error al guardar', 'err'))
  }

  // =========================
  // ELIMINAR
  // =========================

  const eliminar = (id) => { setIdEliminar(id); setMostrarModal(true) }

  const confirmarEliminacion = () => {
    axios.delete(`/api/${pestaña}/${idEliminar}`, api())
      .then(() => { notificar('Eliminado correctamente'); navegarA(pestaña) })
      .catch(() => notificar('Error al eliminar', 'err'))
    setMostrarModal(false)
  }

  // =========================
  // EDITAR
  // FIX citas: al editar, los selects de vehículo y empleado
  // ahora muestran el valor guardado (se extraen los IDs de los objetos)
  // =========================

  const editar = (item) => {
    setItemEditar(item)
    setForm({
      ...item,
      vehiculoId:    item.vehiculo?.id    ?? '',
      empleadoId:    item.empleado?.id    ?? '',
      clienteId:     item.cliente?.id     ?? '',
      presupuestoId: item.presupuesto?.id ?? ''
    })
    setMostrarForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // =========================
  // CERRAR SESIÓN
  // =========================

  const cerrarSesion = () => {
    sessionStorage.removeItem('sesion')
    setSesion({ logueado: false, rol: '', auth: { email: '', pass: '' }, clienteId: null })
    setVista('login')
  }

  // =========================
  // CAMPOS FIJOS POR SECCIÓN
  // FIX pérdida de foco: antes los inputs se generaban con Object.keys(form).map()
  // React destruía y recreaba los nodos en cada render → se perdía el foco al escribir.
  // Con campos fijos, React reutiliza el mismo nodo DOM y el foco se mantiene.
  // =========================

  const camposPorPestaña = {
    clientes:     ['nombre','apellidos','dni','email','telefono','direccion','contrasena'],
    empleados:    ['nombre','dni','puesto','telefono','email','contrasena'],
    vehiculos:    ['matricula','marca','modelo','anio','color'],
    citas:        ['fecha','hora','motivo','estado'],
    presupuestos: ['descripcion','total','estado'],
    facturas:     ['fecha','total'],
    piezas:       ['nombre','referencia','cantidad','precio','stockMinimo']
  }

  const etiquetas = {
    nombre:'Nombre', apellidos:'Apellidos', dni:'DNI / NIE', email:'Email',
    telefono:'Teléfono', direccion:'Dirección', contrasena:'Contraseña',
    puesto:'Puesto', matricula:'Matrícula', marca:'Marca', modelo:'Modelo',
    anio:'Año', color:'Color', fecha:'Fecha', hora:'Hora', motivo:'Motivo',
    estado:'Estado', descripcion:'Descripción', total:'Total €',
    referencia:'Referencia', cantidad:'Cantidad', precio:'Precio €',
    stockMinimo:'Stock mínimo'
  }

  const camposActuales = camposPorPestaña[pestaña] || []

  // =========================
  // VISTA LOGIN / REGISTRO
  // =========================

  if (!sesion.logueado) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">

          <div className="auth-logo">
            W<span>&amp;</span>O
          </div>
          <p className="auth-marca">Taller Mecánico</p>

          {mensaje && (
            <div className={`toast toast-${mensaje.tipo}`}>{mensaje.texto}</div>
          )}

          {vista !== 'register' ? (
            <>
              <h2 className="auth-titulo">Iniciar sesión</h2>
              <form onSubmit={handleLogin} className="auth-form">

                <div className="field">
                  <label>Email</label>
                  <input type="email" required placeholder="tu@email.com"
                    value={sesion.auth.email}
                    onChange={e => setSesion(s => ({ ...s, auth: { ...s.auth, email: e.target.value } }))}
                  />
                </div>

                <div className="field">
                  <label>Contraseña</label>
                  <input type="password" required placeholder="••••••••"
                    value={sesion.auth.pass}
                    onChange={e => setSesion(s => ({ ...s, auth: { ...s.auth, pass: e.target.value } }))}
                  />
                </div>

                <button type="submit" className="btn-primary btn-full">Acceder</button>
                <p className="auth-link">
                  ¿Cliente nuevo?{' '}
                  <span onClick={() => setVista('register')}>Crear cuenta</span>
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 className="auth-titulo">Crear cuenta</h2>
              <form onSubmit={handleRegistro} className="auth-form">

                {[
                  { clave: 'nombre',     etiqueta: 'Nombre',      tipo: 'text',     ph: 'Tu nombre' },
                  { clave: 'apellidos',  etiqueta: 'Apellidos',   tipo: 'text',     ph: 'Tus apellidos' },
                  { clave: 'dni',        etiqueta: 'DNI / NIE',   tipo: 'text',     ph: '12345678A' },
                  { clave: 'email',      etiqueta: 'Email',        tipo: 'email',    ph: 'tu@email.com' },
                  { clave: 'telefono',   etiqueta: 'Teléfono',    tipo: 'tel',      ph: '600 000 000' },
                  { clave: 'direccion',  etiqueta: 'Dirección',   tipo: 'text',     ph: 'Calle, número, ciudad' },
                  { clave: 'contrasena', etiqueta: 'Contraseña',  tipo: 'password', ph: 'Mínimo 6 caracteres' }
                ].map(({ clave, etiqueta, tipo, ph }) => (
                  <div className="field" key={clave}>
                    <label>{etiqueta}</label>
                    <input type={tipo} required placeholder={ph}
                      value={formRegistro[clave]}
                      onChange={e => setFormRegistro(r => ({ ...r, [clave]: e.target.value }))}
                    />
                  </div>
                ))}

                <button type="submit" className="btn-primary btn-full">Registrarme</button>
                <p className="auth-link">
                  <span onClick={() => setVista('login')}>← Volver al inicio</span>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    )
  }

  // =========================
    // VISTA CLIENTE
    // =========================

    if (sesion.rol === 'CLIENTE') {
      return (
        <div className="app-layout">
          {/* CORREGIDO: Mapeadas las propiedades al inglés para que coincidan con Sidebar.jsx */}
          <Sidebar
            session={{ role: sesion.rol }}
            tab={pestaña}
            setTab={setPestaña}
            logout={cerrarSesion}
          />
          <main className="contenido-principal">
            {/* CONTROL: Si datos[0] aún no ha cargado, ponemos un indicador de carga */}
            {datos[0] ? (
              <ClienteView cliente={datos[0]} vehiculos={vehiculos} citas={citasCliente} />
            ) : (
              <div className="barra-carga">Cargando tus datos de perfil...</div>
            )}
          </main>
        </div>
      )
    }


  // =========================
  // VISTA PRINCIPAL — ADMIN / EMPLEADO
  // =========================

  return (
    <div className="app-layout">
      <Sidebar rol={sesion.rol} pestaña={pestaña} setPestaña={navegarA} cerrarSesion={cerrarSesion} />

      <main className="contenido-principal">

        {mensaje && (
          <div className={`toast toast-${mensaje.tipo}`}>{mensaje.texto}</div>
        )}

        <Header
          titulo={pestaña.charAt(0).toUpperCase() + pestaña.slice(1)}
          onNuevo={() => { setItemEditar(null); setForm({}); setMostrarForm(true) }}
        />

        <Buscador onBuscar={handleBusqueda} />

        {cargando && <div className="barra-carga" />}

        {mostrarForm && (
          <div className="form-card">
            <form onSubmit={guardar}>
              <div className="form-grid">

                {/* FIX pérdida de foco: campos fijos por sección */}
                {camposActuales.map(clave => (
                  <div className="field" key={clave}>
                    <label>{etiquetas[clave] || clave}</label>
                    <input
                      value={form[clave] || ''}
                      type={clave === 'contrasena' ? 'password' : 'text'}
                      placeholder={etiquetas[clave] || clave}
                      onChange={e => setForm(f => ({ ...f, [clave]: e.target.value }))}
                    />
                  </div>
                ))}

                {/* Select cliente para vehículos */}
                {pestaña === 'vehiculos' && (
                  <div className="field">
                    <label>Cliente</label>
                    <select value={form.clienteId || ''}
                      onChange={e => setForm(f => ({ ...f, clienteId: e.target.value }))}>
                      <option value="">Selecciona un cliente</option>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre} {c.apellidos}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Selects vehículo y empleado para citas */}
                {pestaña === 'citas' && (
                  <>
                    <div className="field">
                      <label>Vehículo</label>
                      <select value={form.vehiculoId || ''}
                        onChange={e => setForm(f => ({ ...f, vehiculoId: e.target.value }))}>
                        <option value="">Selecciona un vehículo</option>
                        {vehiculos.map(v => (
                          <option key={v.id} value={v.id}>{v.matricula} — {v.marca} {v.modelo}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>Empleado</label>
                      <select value={form.empleadoId || ''}
                        onChange={e => setForm(f => ({ ...f, empleadoId: e.target.value }))}>
                        <option value="">Selecciona un empleado</option>
                        {empleados.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.nombre} — {emp.puesto}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Select presupuesto para facturas */}
                {pestaña === 'facturas' && (
                  <div className="field">
                    <label>Presupuesto</label>
                    <select value={form.presupuestoId || ''}
                      onChange={e => setForm(f => ({ ...f, presupuestoId: e.target.value }))}>
                      <option value="">Selecciona un presupuesto</option>
                      {presupuestos.map(p => (
                        <option key={p.id} value={p.id}>#{p.id} — {p.descripcion}</option>
                      ))}
                    </select>
                  </div>
                )}

              </div>

              <div className="acciones-form">
                <button type="submit" className="btn-primary">
                  {itemEditar ? 'Actualizar' : 'Guardar'}
                </button>
                <button type="button" className="btn-secundario" onClick={() => setMostrarForm(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="tabla-card">
          {pestaña === 'vehiculos'    && <Vehiculos    data={filtrados} onEdit={editar} onDelete={eliminar} />}
          {pestaña === 'clientes'     && <Clientes     data={filtrados} onEdit={editar} onDelete={eliminar} />}
          {pestaña === 'empleados'    && <Empleados    data={filtrados} onEdit={editar} onDelete={eliminar} />}
          {pestaña === 'citas'        && <Citas        data={filtrados} onEdit={editar} onDelete={eliminar} />}
          {pestaña === 'presupuestos' && <Presupuestos data={filtrados} onEdit={editar} onDelete={eliminar} />}
          {pestaña === 'facturas'     && <Facturas     data={filtrados} onEdit={editar} onDelete={eliminar} />}
          {pestaña === 'piezas'       && <Piezas       data={filtrados} onEdit={editar} onDelete={eliminar} />}
        </div>

      </main>

      <Modal
        show={mostrarModal}
        title="Eliminar registro"
        text="¿Seguro que deseas eliminar este registro? Esta acción no se puede deshacer."
        onConfirm={confirmarEliminacion}
        onClose={() => setMostrarModal(false)}
      />

    </div>
  )
}

export default App