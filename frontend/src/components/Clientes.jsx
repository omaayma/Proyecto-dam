function Clientes({ data, onEdit, onDelete, search }) {

  const filtrados = data.filter(c =>
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.apellidos?.toLowerCase().includes(search.toLowerCase()) ||
    c.dni?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>DNI</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {filtrados.map(c => (
          <tr key={c.id}>
            <td>{c.nombre}</td>
            <td>{c.apellidos}</td>
            <td>{c.dni}</td>
            <td>{c.email}</td>
            <td>{c.telefono || '—'}</td>

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

export default Clientes