function Presupuestos({ data, onEdit, onDelete, search }) {

  const filtrados = data.filter(p =>
    p.estado?.toLowerCase().includes(search.toLowerCase()) ||
    p.vehiculo?.matricula?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Vehículo</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {filtrados.map(p => (
          <tr key={p.id}>
            <td>{p.fecha}</td>

            <td>
              <b>{p.total}€</b>
            </td>

            <td>
              <span className={`badge badge-${p.estado?.toLowerCase()}`}>
                {p.estado}
              </span>
            </td>

            <td>
              {p.vehiculo
                ? p.vehiculo.matricula
                : '—'}
            </td>

            <td className="acciones">
              <button className="btn-edit" onClick={() => onEdit(p)}>
                ✏️ Editar
              </button>

              <button className="btn-del" onClick={() => onDelete(p.id)}>
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Presupuestos