// ClienteView.jsx

import React from 'react'

function ClienteView({
  tab,
  cliente,
  vehiculos,
  citas,
  presupuestos,
  facturas
}) {

  const showVehiculos = tab === 'dashboard' || tab === 'vehiculos'
  const showCitas = tab === 'dashboard' || tab === 'citas'
  const showPresupuestos = tab === 'dashboard' || tab === 'presupuestos'
  const showFacturas = tab === 'dashboard' || tab === 'facturas'

  return (
    <div className="cliente-view-wrapper">

      <h1 className="dashboard-welcome">
        Bienvenido, {cliente?.nombre}
      </h1>

      <div className="cliente-grid-layout">

        {/* VEHÍCULOS */}
        {showVehiculos && (
          <div className="panel-seccion">

          <h3>🚘 Mis Vehículos</h3>

          <div className="tarjetas-lista">

            {vehiculos?.length > 0 ? (
              vehiculos.map(v => (
                <div className="tarjeta-dato" key={v.id}>
                  <label>{v.matricula}</label>

                  <span>
                    {v.marca} {v.modelo} ({v.anio})
                  </span>
                </div>
              ))
            ) : (
              <p className="empty-text">
                Sin registros.
              </p>
            )}

          </div>

        </div>
        )}


        {/* CITAS */}
        {showCitas && (
          <div className="panel-seccion">

          <h3>📅 Mis Citas</h3>

          <div className="grid-citas">

            {citas?.length > 0 ? (
              citas.map(c => (
                <div className="tarjeta-dato" key={c.id}>

                  <label>
                    {c.fecha} - {c.hora}
                  </label>

                  <span>
                    {c.descripcion}
                  </span>

                  <div style={{ marginTop: '14px' }}>
                    <span className={`badge badge-${c.estado?.toLowerCase()}`}>
                      {c.estado}
                    </span>
                  </div>

                </div>
              ))
            ) : (
              <p className="empty-text">
                Sin registros.
              </p>
            )}

          </div>

        </div>
        )}

        {/* PRESUPUESTOS */}

        {showPresupuestos && (
          <div className="panel-seccion">

          <h3>🧾 Mis Presupuestos</h3>

          <div className="tarjetas-lista">

            {presupuestos?.length > 0 ? (
              presupuestos.map(p => (
                <div className="tarjeta-dato" key={p.id}>

                  <label>
                    Presupuesto #{p.id}
                  </label>

                  <span>
                    {p.total}€
                  </span>

                </div>
              ))
            ) : (
              <p className="empty-text">
                Sin registros.
              </p>
            )}

          </div>

        </div>
        )}

        {/* FACTURAS */}

        {showFacturas && (
          <div className="panel-seccion">

          <h3>📄 Mis Facturas</h3>

          <div className="tarjetas-lista">

            {facturas?.length > 0 ? (
              facturas.map(f => (
                <div className="tarjeta-dato" key={f.id}>

                  <label>
                    Factura #{f.id}
                  </label>

                  <span>
                    {f.total}€
                  </span>

                </div>
              ))
            ) : (
              <p className="empty-text">
                Sin registros.
              </p>
            )}

          </div>

        </div>
        )}

      </div>

    </div>
  )
}

export default ClienteView