function Vehiculos({ data, onEdit, onDelete, search }) {

  const filtrados = data.filter(v =>
    v.matricula?.toLowerCase().includes(search.toLowerCase()) ||
    v.marca?.toLowerCase().includes(search.toLowerCase()) ||
    v.modelo?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <table>
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Cliente</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {filtrados.map(v => (
          <tr key={v.id}>
            <td><b>{v.matricula}</b></td>
            <td>{v.marca}</td>
            <td>{v.modelo}</td>
            <td>{v.anio}</td>

            <td>
              {v.cliente
                ? `${v.cliente.nombre} ${v.cliente.apellidos || ''}`
                : '—'}
            </td>

            <td className="acciones">
              <button className="btn-edit" onClick={() => onEdit(v)}>
                ✏️ Editar
              </button>

              <button className="btn-del" onClick={() => onDelete(v.id)}>
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Vehiculos