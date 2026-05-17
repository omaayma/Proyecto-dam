// Sidebar.jsx

import React from 'react'

function Sidebar({ session, tab, setTab, logout }) {

  const rol = session?.rol?.toUpperCase()

  const adminItems = [
    ['vehiculos', '🚗 Vehículos'],
    ['citas', '📅 Citas'],
    ['presupuestos', '🧾 Presupuestos'],
    ['facturas', '📄 Facturas'],
    ['clientes', '👤 Clientes'],
    ['piezas', '📦 Stock'],
    ['empleados', '👨‍🔧 Empleados']
  ]

  const empleadoItems = [
    ['vehiculos', '🚗 Vehículos'],
    ['citas', '📅 Citas'],
    ['presupuestos', '🧾 Presupuestos'],
    ['facturas', '📄 Facturas'],
    ['clientes', '👤 Clientes'],
    ['piezas', '📦 Stock']
  ]

  const clienteItems = [
    ['dashboard', '🚘 Vehículos'],
    ['citas', '📅 Citas'],
    ['presupuestos', '🧾 Presupuestos'],
    ['facturas', '📄 Facturas']
  ]

  let items = []

  if (rol === 'ADMIN') items = adminItems
  else if (rol === 'EMPLEADO') items = empleadoItems
  else items = clienteItems

  return (
    <aside className="sidebar">

      <div>

        <div className="sidebar-logo">
          W<span>&O</span>
        </div>

        <div className="sidebar-nav">

          {items.map(i => (
            <button
              key={i[0]}
              className={`nav-item ${tab === i[0] ? 'active' : ''}`}
              onClick={() => setTab(i[0])}
            >
              {i[1]}
            </button>
          ))}

        </div>

      </div>

      <div className="sidebar-footer">

        <div className="sidebar-user">

          <div className="avatar">
            {session?.nombre?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <div className="user-email">
              {session?.auth?.email}
            </div>

            <div className={`user-role role-${rol?.toLowerCase()}`}>
              {rol}
            </div>
          </div>

        </div>

        <button className="btn-logout" onClick={logout}>
          Cerrar sesión
        </button>

      </div>

    </aside>
  )
}

export default Sidebar