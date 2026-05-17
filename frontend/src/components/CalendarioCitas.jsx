import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
 

export default function CalendarioCitas({ citas }) {
 

  const eventos = citas.map(c => ({
    title: c.descripcion || "Cita",
    date: c.fecha
  }))
 

  return (
    <div style={{ padding: "20px" }}>
 

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={eventos}
        height="70vh"
 

        dateClick={(info) => {
          alert("Día seleccionado: " + info.dateStr)
        }}
      />
 

    </div>
  )
}