import React from 'react';
 

function Facturas({ data, onEdit, onDelete }) {
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
        {data.map(f => (
          <tr key={f.id}>
            <td>{f.fecha}</td>
            <td><b>{f.total}€</b></td>
            <td>{f.presupuesto ? `#${f.presupuesto.id}` : '—'}</td>
            <td>
              <button onClick={() => onEdit(f)}>✏️ Editar</button>
              <button onClick={() => onDelete(f.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
 

export default Facturas;