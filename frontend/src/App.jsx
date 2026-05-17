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

function App() {

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

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('vehiculos')
  const [data, setData] = useState([])

  const [vehiculosCliente, setVehiculosCliente] = useState([])
  const [citasCliente, setCitasCliente] = useState([])

  const [modalEliminar, setModalEliminar] = useState({
    open: false,
    id: null
  })

  const rol = sesion?.rol?.toUpperCase()

  useEffect(() => {

    if (!sesion.logueado) return

    if (rol === 'CLIENTE') {

      axios.get('/api/vehiculos')
        .then(res => {
          const filtrados = res.data.filter(v => v?.cliente?.id === sesion.clienteId)
          setVehiculosCliente(filtrados)
        })

      axios.get('/api/citas')
        .then(res => {
          const filtradas = res.data.filter(c => c?.vehiculo?.cliente?.id === sesion.clienteId)
          setCitasCliente(filtradas)
        })

    } else {

      axios.get(`/api/${tab}`)
        .then(res => setData(res.data))
        .catch(() => setData([]))
    }

  }, [sesion, tab])

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

  const handleLogin = (e) => {

    e.preventDefault()

    const email = e.target.email.value
    const pass = e.target.password.value

    const auth = {
      headers: {
        Authorization: `Basic ${btoa(email + ':' + pass)}`
      }
    }

    axios.get('/api/empleados', auth)

      .then(res => {

        const usuario = res.data.find(u => u.email === email)

        if (!usuario) return

        setSesion({
          logueado: true,
          rol: usuario.rol,
          nombre: usuario.nombre,
          auth: { email, pass }
        })
      })

      .catch(() => {

        axios.get('/api/clientes', auth)

          .then(res => {

            const cliente = res.data.find(c => c.email === email)

            if (!cliente) {
              alert('Credenciales incorrectas')
              return
            }

            setSesion({
              logueado: true,
              rol: 'CLIENTE',
              nombre: cliente.nombre,
              clienteId: cliente.id,
              auth: { email, pass }
            })
          })

          .catch(() => {
            alert('Credenciales incorrectas')
          })
      })
  }

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

    axios.post('/api/clientes', body)

      .then(() => {

        alert('Cuenta creada correctamente')

        setView('login')
      })

      .catch(() => {
        alert('Error al registrar')
      })
  }

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
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="field">
                  <label>Contraseña</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button className="login-btn" type="submit">
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

                <button className="login-btn" type="submit">
                  Crear cuenta
                </button>

                <p className="auth-switch">
                  ¿Ya tienes cuenta?

                  <span onClick={() => setView('login')}>
                    Volver al login
                  </span>
                </p>

              </form>
            </>
          )}
        </div>
      </div>
    )
  }

  return (

    <div className="app-layout">

      <Sidebar
        session={sesion}
        tab={tab}
        setTab={setTab}
        logout={logout}
      />

      <main className="contenido-principal">

        {rol === 'CLIENTE' ? (

          <ClienteView
            cliente={sesion}
            vehiculos={vehiculosCliente}
            citas={citasCliente}
          />

        ) : (

          <>
            <Header
              title={`Gestión de ${tab}`}
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
                />
              }

              {tab === 'clientes' &&
                <Clientes
                  data={data}
                  search={search}
                />
              }

              {tab === 'empleados' && rol === 'ADMIN' &&
                <Empleados
                  data={data}
                  search={search}
                />
              }

              {tab === 'citas' &&
                <Citas
                  data={data}
                  search={search}
                />
              }

              {tab === 'presupuestos' &&
                <Presupuestos
                  data={data}
                  search={search}
                />
              }

              {tab === 'facturas' &&
                <Facturas
                  data={data}
                  search={search}
                />
              }

              {tab === 'piezas' &&
                <Piezas
                  data={data}
                  search={search}
                />
              }

            </div>
          </>
        )}
      </main>

      <Modal
        open={modalEliminar.open}
        title="Eliminar"
        text="¿Seguro que deseas eliminar?"
      />

    </div>
  )
}

export default App