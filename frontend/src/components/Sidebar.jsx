function Sidebar({ session, tab, setTab, logout }) {

  const items = [
    ['vehiculos', 'Vehículos'],
    ['clientes', 'Clientes'],
    ['empleados', 'Empleados'],
    ['citas', 'Citas'],
    ['presupuestos', 'Presupuestos'],
    ['facturas', 'Facturas'],
    ['piezas', 'Piezas']
  ]

  return (
    <aside className="sidebar">

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

      <div className="sidebar-footer">
        <div className={`role-badge role-${session.role?.toLowerCase()}`}>
          {session.role}
        </div>

        <button className="btn-logout" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

    </aside>
  )
}

export default Sidebar