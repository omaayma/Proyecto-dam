import React from 'react';
 

function Clientes({ data, onEdit, onDelete }) {
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
        {data.map(c => (
          <tr key={c.id}>
            <td>{c.nombre}</td>
            <td>{c.apellidos}</td>
            <td>{c.dni}</td>
            <td>{c.email}</td>
            <td>{c.telefono || '—'}</td>
            <td>
              <button onClick={() => onEdit(c)}>✏️ Editar</button>
              <button onClick={() => onDelete(c.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
 

export default Clientes;