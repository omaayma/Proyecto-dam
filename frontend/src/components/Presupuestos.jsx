import React from 'react';
 

function Presupuestos({ data, onEdit, onDelete }) {
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
        {data.map(p => (
          <tr key={p.id}>
            <td>{p.fecha}</td>
            <td><b>{p.total}€</b></td>
            <td>{p.estado}</td>
            <td>{p.vehiculo ? p.vehiculo.matricula : '—'}</td>
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
 

export default Presupuestos;