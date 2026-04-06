import { useState } from 'react'
import axios from 'axios'
 

function App() {
 

  // ===== ESTADOS =====
  const [vehiculos, setVehiculos] = useState([])
  const [clientes, setClientes] = useState([])
  const [empleados, setEmpleados] = useState([])
 

  // ===== VEHÍCULOS =====
  const mostrarVehiculos = () => {
    axios.get('/vehiculos')
      .then(res => {
        setVehiculos(res.data)
        console.log('Vehículos:', res.data)
      })
      .catch(err => console.error('Error cargando vehículos:', err))
  }
 

  const crearVehiculo = () => {
    axios.post('/vehiculos', {
      matricula: '1234ABC',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020
    }).then(() => {
      mostrarVehiculos()
    })
  }
 

  // ===== CLIENTES =====
  const mostrarClientes = () => {
    axios.get('/clientes')
      .then(res => {
        setClientes(res.data)
        console.log('Clientes:', res.data)
      })
      .catch(err => console.error('Error cargando clientes:', err))
  }
 

  const crearCliente = () => {
    axios.post('/clientes', {
      nombre: 'Juan',
      apellidos: 'Pérez',
      dni: '12345678A',
      telefono: '600123456',
      email: 'juan.perez@email.com'
    }).then(() => {
      mostrarClientes()
    })
  }
 

  // EMPLEADOS
  const mostrarEmpleados = () => {
    axios.get('/empleados')
      .then(res => {
        setEmpleados(res.data)
        console.log('Empleados:', res.data)
      })
      .catch(err => console.error('Error cargando empleados:', err))
  }
 

  const crearEmpleado = () => {
    axios.post('/empleados', {
      nombre: 'Ana',
      dni: '87654321B',
      puesto: 'Mecánico',
      telefono: '600987654',
      email: 'ana.mecanico@email.com'
    }).then(() => {
      mostrarEmpleados()
    })
  }
 

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Funcionalidad parcial – Frontend / Backend</h1>
 

      {/* ===== BOTONES ===== */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={mostrarVehiculos}>Mostrar vehículos</button>
        <button onClick={crearVehiculo} style={{ marginLeft: '10px' }}>
          Crear vehículo
        </button>
 

        <button onClick={mostrarClientes} style={{ marginLeft: '10px' }}>
          Mostrar clientes
        </button>
        <button onClick={crearCliente} style={{ marginLeft: '10px' }}>
          Crear cliente
        </button>
 

        <button onClick={mostrarEmpleados} style={{ marginLeft: '10px' }}>
          Mostrar empleados
        </button>
        <button onClick={crearEmpleado} style={{ marginLeft: '10px' }}>
          Crear empleado
        </button>
      </div>
 

      {/* ===== LISTADOS ===== */}
      <h2></h2>
      <ul>
        {vehiculos.map(v => (
          <li key={v.id}>
            {v.matricula} – {v.marca} {v.modelo}
          </li>
        ))}
      </ul>
 

      <h2></h2>
      <ul>
        {clientes.map(c => (
          <li key={c.id}>
            {c.nombre} {c.apellidos} – {c.dni}
          </li>
        ))}
      </ul>
 

      <h2>Empleados</h2>
      <ul>
        {empleados.map(e => (
          <li key={e.id}>
            {e.nombre} – {e.puesto} – {e.dni}
          </li>
        ))}
      </ul>
    </div>
  )
}
 

export default App
