import React from 'react';
 

function Empleados({ data, onEdit, onDelete }) {
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
        {data.map(e => (
          <tr key={e.id}>
            <td>{e.nombre}</td>
            <td>{e.dni}</td>
            <td>{e.puesto || '—'}</td>
            <td>{e.email}</td>
            <td>
              <button onClick={() => onEdit(e)}>✏️ Editar</button>
              <button onClick={() => onDelete(e.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
 

export default Empleados;