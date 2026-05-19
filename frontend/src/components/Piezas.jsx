function Piezas({ data, onEdit, onDelete, search }) {
  const filtrados = data.filter(p => p.nombre?.toLowerCase().includes(search.toLowerCase()))

  return (
    <table>
      <thead>
        <tr><th>Nombre</th><th>Descripción</th><th>Stock</th><th>Precio</th><th></th></tr>
      </thead>
      <tbody>
        {filtrados.map(p => (
          <tr key={p.id} className={p.stock < 5 ? 'fila-alerta' : ''}>
            <td>{p.nombre}</td>
            <td>{p.descripcion || '—'}</td>
            <td className={p.stock < 5 ? 'stock-low' : 'stock-ok'}>
              {p.stock < 5 && '⚠️ '}{p.stock} uds
            </td>
            <td>{p.precio}€</td>
            <td className="acciones">
              <button className="btn-edit" onClick={() => onEdit(p)}>✏️ Editar</button>
              <button className="btn-del"  onClick={() => onDelete(p.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Piezas