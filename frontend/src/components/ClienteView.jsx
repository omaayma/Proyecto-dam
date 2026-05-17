function ClienteView({ cliente, vehiculos, citas }) {

  return (
    <div className="cliente-grid">

      <div className="cliente-section">
        <h2>Mi perfil</h2>
        <div className="info-list">
          <div className="info-card">
            <b>Nombre</b>
            {/* CORREGIDO: Uso de ?. por seguridad */}
            <span>{cliente?.nombre} {cliente?.apellidos}</span>
          </div>

          <div className="info-card">
            <b>Email</b>
            <span>{cliente?.email}</span>
          </div>

          <div className="info-card">
            <b>DNI</b>
            <span>{cliente?.dni}</span>
          </div>

          <div className="info-card">
            <b>Teléfono</b>
            <span>{cliente?.telefono || 'No disponible'}</span>
          </div>
        </div>
      </div>

      <div className="cliente-section">
        <h2>Mis vehículos</h2>
        <div className="info-list">
          {/* CORREGIDO: Validar que vehiculos exista antes del map */}
          {vehiculos && vehiculos.map(v => (
            <div className="info-card" key={v.id}>
              <b>{v.matricula}</b>
              <span>{v.marca} {v.modelo}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cliente-section">
        <h2>Mis citas</h2>
        <div className="info-list">
          {/* CORREGIDO: Validar que citas exista antes del map */}
          {citas && citas.map(c => (
            <div className="info-card" key={c.id}>
              <b>{c.fecha} - {c.hora}</b>
              <span>{c.estado}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default ClienteView