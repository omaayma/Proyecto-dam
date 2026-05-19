import React from 'react'

function Dashboard({ stats, rol, onNavigate }) {
  if (!stats) return <div className="dashboard-loading">⏳ Cargando panel...</div>

  const tarjetas = [
    { label: 'Clientes', valor: stats.clientes,   icono: '👤', tab: 'clientes',     color: '#3b82f6' },
    { label: 'Vehículos', valor: stats.vehiculos,  icono: '🚗', tab: 'vehiculos',    color: '#8b5cf6' },
    { label: 'Citas hoy', valor: stats.citasHoy,   icono: '📅', tab: 'citas',        color: '#f59e0b' },
    { label: 'Pendientes', valor: stats.citasPendientes, icono: '⏳', tab: 'citas',  color: '#ef4444' },
    { label: 'Presupuestos sin responder', valor: stats.presupuestosPendientes, icono: '📋', tab: 'presupuestos', color: '#f97316' },
    { label: 'Ingresos totales', valor: `${stats.ingresosMes.toFixed(2)}€`, icono: '💶', tab: 'facturas', color: '#10b981' },
    { label: 'Stock bajo', valor: stats.stockBajo, icono: '⚠️', tab: 'piezas',       color: '#dc2626' },
    ...(rol === 'ADMIN' ? [{ label: 'Empleados', valor: stats.empleados, icono: '👨‍🔧', tab: 'empleados', color: '#64748b' }] : []),
  ]

  const hoy = new Date().toISOString().split('T')[0]
  const citasDeHoy = (stats.todasCitas || []).filter(c => c.fecha === hoy).sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))

  return (
    <div className="dashboard-wrapper">
      <h1 className="dashboard-welcome">Panel de control</h1>

      <div className="dashboard-grid">
        {tarjetas.map(t => (
          <div key={t.tab + t.label} className="stat-card" style={{ borderTop: `3px solid ${t.color}`, cursor: 'pointer' }} onClick={() => onNavigate(t.tab)}>
            <div className="stat-icono">{t.icono}</div>
            <div className="stat-valor">{t.valor}</div>
            <div className="stat-label">{t.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-seccion">
        <h3>📅 Citas de hoy</h3>
        {citasDeHoy.length === 0 ? (
          <p className="empty-text">No hay citas para hoy.</p>
        ) : (
          <div className="citas-hoy-lista">
            {citasDeHoy.map(c => (
              <div key={c.id} className="cita-hoy-item">
                <span className="cita-hora">{c.hora}</span>
                <span>{c.vehiculo?.matricula || '—'}</span>
                <span>{c.descripcion || 'Sin descripción'}</span>
                <span className={`badge badge-${c.estado?.toLowerCase()}`}>{c.estado}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard