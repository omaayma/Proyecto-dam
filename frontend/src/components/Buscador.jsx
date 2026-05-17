function Buscador({ value, onChange }) {

  return (
    <input
      type="text"
      placeholder="Buscar..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}

export default Buscador