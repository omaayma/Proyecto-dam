function Citas({ data, onEdit, onDelete, search }) {

  const filtrados = data.filter(c =>
    c.estado?.toLowerCase().includes(search.toLowerCase()) ||
    c.vehiculo?.matricula?.toLowerCase().includes(search.toLowerCase()) ||
    c.empleado?.nombre?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Vehículo</th>
          <th>Empleado</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {filtrados.map(c => (
          <tr key={c.id}>
            <td>{c.fecha}</td>
            <td>{c.hora}</td>

            <td>
              {c.vehiculo
                ? c.vehiculo.matricula
                : '—'}
            </td>

            <td>
              {c.empleado
                ? c.empleado.nombre
                : '—'}
            </td>

            <td>
              <span className={`badge badge-${c.estado?.toLowerCase()}`}>
                {c.estado}
              </span>
            </td>

            <td className="acciones">
              <button className="btn-edit" onClick={() => onEdit(c)}>
                ✏️ Editar
              </button>

              <button className="btn-del" onClick={() => onDelete(c.id)}>
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Citas