import React from 'react';
 

function Vehiculos({ data, onEdit, onDelete }) {
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
        {data.map(v => (
          <tr key={v.id}>
            <td><b>{v.matricula}</b></td>
            <td>{v.marca}</td>
            <td>{v.modelo}</td>
            <td>{v.anio}</td>
            <td>{v.cliente ? `${v.cliente.nombre} ${v.cliente.apellidos || ''}` : '—'}</td>
            <td>
              <button onClick={() => onEdit(v)}>✏️ Editar</button>
              <button onClick={() => onDelete(v.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
 

export default Vehiculos;
