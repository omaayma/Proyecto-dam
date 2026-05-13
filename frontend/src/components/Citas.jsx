import React from 'react';
 

function Citas({ data, onEdit, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Vehículo</th>
          <th>Empleado</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map(c => (
          <tr key={c.id}>
            <td>{c.fecha}</td>
            <td>{c.hora}</td>
            <td>{c.vehiculo ? `${c.vehiculo.matricula}` : '—'}</td>
            <td>{c.empleado ? c.empleado.nombre : '—'}</td>
            <td>{c.estado}</td>
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
 

export default Citas;