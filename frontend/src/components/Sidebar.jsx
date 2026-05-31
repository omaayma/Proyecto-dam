import React from 'react'
 
function Sidebar({ session, tab, setTab, logout, onConfig, stockAlerta, mensajesNoLeidos }) {
  const rol = session?.rol?.toUpperCase()

  const adminItems = [
    ['dashboard',    '🏠 Dashboard'],
    ['vehiculos',    '🚗 Vehículos'],
    ['citas',        '📅 Citas'],
    ['presupuestos', '🧾 Presupuestos'],
    ['facturas',     '📄 Facturas'],
    ['clientes',     '👤 Clientes'],
    ['piezas',       `📦 Stock${stockAlerta ? ' 🔴' : ''}`],
    ['empleados',    '👨‍🔧 Empleados'],
    ['mensajes',     `✉️ Mensajes${mensajesNoLeidos > 0 ? ` (${mensajesNoLeidos})` : ''}`],
  ]

  const empleadoItems = [
    ['dashboard',    '🏠 Dashboard'],
    ['vehiculos',    '🚗 Vehículos'],
    ['citas',        '📅 Citas'],
    ['presupuestos', '🧾 Presupuestos'],
    ['facturas',     '📄 Facturas'],
    ['clientes',     '👤 Clientes'],
    ['piezas',       `📦 Stock${stockAlerta ? ' 🔴' : ''}`],
    ['mensajes',     `✉️ Mensajes${mensajesNoLeidos > 0 ? ` (${mensajesNoLeidos})` : ''}`],
  ]

  const clienteItems = [
    ['dashboard',    '🏠 Inicio'],
    ['vehiculos',    '🚗 Vehículos'],
    ['citas',        '📅 Citas'],
    ['presupuestos', '📋 Presupuestos'],
    ['facturas',     '🧾 Facturas'],
    ['perfil',       '👤 Mi Perfil'],
  ]

  const items = rol === 'ADMIN' ? adminItems : rol === 'EMPLEADO' ? empleadoItems : clienteItems

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo-img">
          <img src="/logo.png" alt="W&O" style={{ height: '44px', objectFit: 'contain', maxWidth: '180px' }} />
        </div>
        <div className="sidebar-nav" style={{ marginTop: '5px' }}>
          {items.map(i => (
            <button key={i[0]} className={`nav-item ${tab === i[0] ? 'active' : ''}`} onClick={() => setTab(i[0])}>
              {i[1]}
            </button>
          ))}
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{session?.nombre?.charAt(0)?.toUpperCase()}</div>
          <div>
            <div className="user-email">{session?.auth?.email}</div>
            <div className={`user-role role-${rol?.toLowerCase()}`}>{rol}</div>
          </div>
        </div>
        <button className="btn-config" onClick={onConfig}>⚙️ Configuración</button>
        <button className="btn-logout" onClick={logout}>Cerrar sesión</button>
      </div>
    </aside>
  )
}
 
export default Sidebar