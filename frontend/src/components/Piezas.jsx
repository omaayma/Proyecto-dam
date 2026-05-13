import React from 'react';
 

function Piezas({ data, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Stock</th>
          <th>Precio</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map(p => (
          <tr key={p.id}>
            <td>{p.nombre}</td>
            <td>{p.descripcion || '—'}</td>
            <td>{p.stock} uds</td>
            <td>{p.precio}€</td>
            <td>
              <button onClick={() => onEdit(p)}>✏️ Editar</button>
              <button onClick={() => onDelete(p.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
 

export default Piezas;