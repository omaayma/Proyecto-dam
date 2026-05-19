import React, { useState } from 'react'

function CalendarioCitas({ citas, onNuevaCita }) {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  const primerDia  = new Date(anio, mes, 1).getDay()
  const diasMes    = new Date(anio, mes + 1, 0).getDate()
  const offset     = primerDia === 0 ? 6 : primerDia - 1

  const citasPorDia = {}
  citas.forEach(c => {
    if (!c.fecha) return
    const [y, m2, d] = c.fecha.split('-')
    if (parseInt(y) === anio && parseInt(m2) - 1 === mes) {
      const key = parseInt(d)
      if (!citasPorDia[key]) citasPorDia[key] = []
      citasPorDia[key].push(c)
    }
  })

  const citasDelDia = diaSeleccionado ? (citasPorDia[diaSeleccionado] || []) : []

  const anterior = () => { if (mes === 0) { setMes(11); setAnio(a => a - 1) } else setMes(m => m - 1); setDiaSeleccionado(null) }
  const siguiente = () => { if (mes === 11) { setMes(0); setAnio(a => a + 1) } else setMes(m => m + 1); setDiaSeleccionado(null) }

  const celdas = []
  for (let i = 0; i < offset; i++) celdas.push(<div key={`e${i}`} />)
  for (let d = 1; d <= diasMes; d++) {
    const tieneCitas = !!citasPorDia[d]
    const esHoy = d === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()
    celdas.push(
      <div key={d}
        className={`cal-dia ${tieneCitas ? 'cal-con-cita' : ''} ${esHoy ? 'cal-hoy' : ''} ${diaSeleccionado === d ? 'cal-seleccionado' : ''}`}
        onClick={() => setDiaSeleccionado(d === diaSeleccionado ? null : d)}
      >
        <span>{d}</span>
        {tieneCitas && <div className="cal-punto">{citasPorDia[d].length}</div>}
      </div>
    )
  }

  return (
    <div className="calendario-wrapper">
      <div className="cal-nav">
        <button className="btn-edit" onClick={anterior}>← Anterior</button>
        <h2>{meses[mes]} {anio}</h2>
        <button className="btn-edit" onClick={siguiente}>Siguiente →</button>
      </div>

      <div className="cal-semana-header">
        {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="cal-grid">{celdas}</div>

      {diaSeleccionado && (
        <div className="cal-detalle">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Citas del {diaSeleccionado} de {meses[mes]}</h3>
            <button className="login-btn" style={{ padding: '8px 16px', fontSize: '13px' }}
              onClick={() => onNuevaCita(`${anio}-${String(mes+1).padStart(2,'0')}-${String(diaSeleccionado).padStart(2,'0')}`)}>
              + Nueva cita este día
            </button>
          </div>
          {citasDelDia.length === 0 ? (
            <p className="empty-text">No hay citas este día.</p>
          ) : citasDelDia.map(c => (
            <div className="tarjeta-dato" key={c.id} style={{ marginBottom: '10px' }}>
              <label>{c.hora} — {c.vehiculo?.matricula || '—'}</label>
              <span>{c.descripcion || 'Sin descripción'}</span>
              <span className={`badge badge-${c.estado?.toLowerCase()}`}>{c.estado}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CalendarioCitas