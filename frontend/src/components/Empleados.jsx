function Empleados({ data, onEdit, onDelete, search }) {

  const filtrados = data.filter(e =>
    e.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    e.dni?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>DNI</th>
          <th>Puesto</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {filtrados.map(e => (
          <tr key={e.id}>
            <td>{e.nombre}</td>
            <td>{e.dni}</td>
            <td>{e.puesto || '—'}</td>
            <td>{e.email}</td>

            <td className="acciones">
              <button className="btn-edit" onClick={() => onEdit(e)}>
                ✏️ Editar
              </button>

              <button className="btn-del" onClick={() => onDelete(e.id)}>
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Empleados