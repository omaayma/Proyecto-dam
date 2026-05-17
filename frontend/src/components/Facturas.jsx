function Facturas({ data, onEdit, onDelete, search }) {

  const filtrados = data.filter(f =>
    String(f.total).includes(search)
  )

  return (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Total</th>
          <th>Presupuesto</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {filtrados.map(f => (
          <tr key={f.id}>
            <td>{f.fecha}</td>

            <td>
              <b>{f.total}€</b>
            </td>

            <td>
              {f.presupuesto
                ? `#${f.presupuesto.id}`
                : '—'}
            </td>

            <td className="acciones">
              <button className="btn-edit" onClick={() => onEdit(f)}>
                ✏️ Editar
              </button>

              <button className="btn-del" onClick={() => onDelete(f.id)}>
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Facturas