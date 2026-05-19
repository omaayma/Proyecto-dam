import { jsPDF } from 'jspdf'

function Facturas({ data, onEdit, onDelete, search, authConfig }) {

  const filtrados = data.filter(f =>
    String(f.total).includes(search) ||
    String(f.fecha || '').includes(search)
  )

  const generarPDF = (f) => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('W&O TALLER MECÁNICO', 105, 25, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setDrawColor(100, 100, 100)
    doc.line(20, 32, 190, 32)

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`Factura #${f.id}`, 20, 45)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha:`, 20, 58)
    doc.setFont('helvetica', 'bold')
    doc.text(`${f.fecha || '—'}`, 55, 58)

    doc.setFont('helvetica', 'normal')
    doc.text(`Total:`, 20, 68)
    doc.setFont('helvetica', 'bold')
    doc.text(`${f.total}€`, 55, 68)

    doc.setFont('helvetica', 'normal')
    doc.text(`Presupuesto vinculado:`, 20, 78)
    doc.setFont('helvetica', 'bold')
    doc.text(f.presupuesto ? `#${f.presupuesto.id}` : 'Sin presupuesto', 80, 78)

    doc.setDrawColor(100, 100, 100)
    doc.line(20, 88, 190, 88)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(120, 120, 120)
    doc.text('Gracias por confiar en W&O Taller Mecánico', 105, 100, { align: 'center' })

    doc.save(`factura_${f.id}.pdf`)
  }

  return (
    <table>
      <thead>
        <tr><th>Fecha</th><th>Total</th><th>Presupuesto</th><th></th></tr>
      </thead>
      <tbody>
        {filtrados.map(f => (
          <tr key={f.id}>
            <td>{f.fecha}</td>
            <td><b>{f.total}€</b></td>
            <td>{f.presupuesto ? `#${f.presupuesto.id}` : '—'}</td>
            <td className="acciones">
              <button className="btn-edit" onClick={() => generarPDF(f)}>📄 PDF</button>
              <button className="btn-edit" onClick={() => onEdit(f)}>✏️ Editar</button>
              <button className="btn-del"  onClick={() => onDelete(f.id)}>🗑️</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Facturas