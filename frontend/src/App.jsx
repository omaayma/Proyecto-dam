import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [session, setSession] = useState({ logged: false, role: '', auth: { email: '', pass: '' } });
  const [view, setView] = useState('login'); // login | register
  const [tab, setTab] = useState('vehiculos');
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});

  const apiConfig = { headers: { Authorization: `Basic ${btoa(session.auth.email + ":" + session.auth.pass)}` } };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.get('/api/vehiculos', apiConfig)
      .then(res => {
        let role = 'CLIENTE';
        if (session.auth.email === 'admin@wo.com') role = 'ADMIN';
        else if (session.auth.email.includes('taller')) role = 'EMPLEADO';
        setSession({ ...session, logged: true, role });
        setData(res.data);
      })
      .catch(() => alert("Credenciales incorrectas"));
  };

  const navigateTo = (newTab) => {
    setTab(newTab);
    setForm({});
    axios.get(`/api/${newTab}`, apiConfig).then(res => setData(res.data)).catch(() => setData([]));
  };

  const onSave = (e) => {
    e.preventDefault();
    axios.post(`/api/${tab}`, form, apiConfig).then(() => {
      alert("Guardado");
      navigateTo(tab);
    });
  };

  // PANTALLA DE ACCESO
  if (!session.logged) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1>W&O</h1>
          {view === 'login' ? (
            <form onSubmit={handleLogin}>
              <p>Inicia sesión en tu cuenta profesional</p>
              <input type="email" placeholder="Email" onChange={e => setSession({...session, auth:{...session.auth, email: e.target.value}})} required />
              <input type="password" placeholder="Contraseña" onChange={e => setSession({...session, auth:{...session.auth, pass: e.target.value}})} required />
              <button className="btn-black" style={{width:'100%', marginTop:'10px'}}>Acceder</button>
              <p style={{fontSize:'13px', marginTop:'20px'}}>¿Eres un cliente nuevo? <span onClick={()=>setView('register')} style={{color:'var(--accent)', cursor:'pointer', fontWeight:600}}>Crea una cuenta</span></p>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); alert("Registro enviado"); setView('login'); }}>
              <p>Registro de Cliente</p>
              <input placeholder="Nombre completo" required />
              <input placeholder="DNI" required />
              <input type="email" placeholder="Correo electrónico" required />
              <input type="password" placeholder="Establecer contraseña" required />
              <button className="btn-black" style={{width:'100%', marginTop:'10px'}}>Registrarme</button>
              <p onClick={()=>setView('login')} style={{fontSize:'13px', marginTop:'20px', color:'var(--text-muted)', cursor:'pointer'}}>Volver al login</p>
            </form>
          )}
        </div>
      </div>
    );
  }

  // DASHBOARD PRINCIPAL
  return (
    <div className="app-grid">
      <aside className="sidebar">
        <h2>W&O TALLER</h2>
        <div className="nav-group">
          <button className={`nav-item ${tab === 'vehiculos' ? 'active' : ''}`} onClick={() => navigateTo('vehiculos')}>🚗 Vehículos</button>
          <button className={`nav-item ${tab === 'citas' ? 'active' : ''}`} onClick={() => navigateTo('citas')}>📅 Citas</button>

          {session.role !== 'CLIENTE' && (
            <>
              <button className={`nav-item ${tab === 'clientes' ? 'active' : ''}`} onClick={() => navigateTo('clientes')}>👤 Clientes</button>
              <button className={`nav-item ${tab === 'piezas' ? 'active' : ''}`} onClick={() => navigateTo('piezas')}>📦 Stock</button>
            </>
          )}

          {session.role === 'ADMIN' && (
            <button className={`nav-item ${tab === 'empleados' ? 'active' : ''}`} onClick={() => navigateTo('empleados')}>👨‍🔧 Empleados</button>
          )}
        </div>

        <div style={{borderTop:'1px solid var(--border)', paddingTop:'20px'}}>
          <p style={{fontSize:'12px', color:'var(--text-muted)', marginBottom:'5px'}}>Usuario: {session.role}</p>
          <button onClick={()=>window.location.reload()} style={{color:'#d93025', border:'none', background:'none', padding:0, cursor:'pointer', fontWeight:600}}>Cerrar Sesión</button>
        </div>
      </aside>

      <main className="main-panel">
        <div className="section-header">
          <h1>{tab.charAt(0).toUpperCase() + tab.slice(1)}</h1>
        </div>

        {/* Formulario de Alta (Sólo Admin o Empleado) */}
        {session.role !== 'CLIENTE' && (
          <div className="card">
            <h3 style={{marginTop:0}}>Nuevo Registro</h3>
            <form className="form-grid" onSubmit={onSave}>
              {tab === 'vehiculos' && (
                <>
                  <input placeholder="Matrícula" onChange={e => setForm({...form, matricula: e.target.value})} required />
                  <input placeholder="Marca" onChange={e => setForm({...form, marca: e.target.value})} required />
                  <input placeholder="Modelo" onChange={e => setForm({...form, modelo: e.target.value})} required />
                </>
              )}
              {tab === 'empleados' && (
                <>
                  <input placeholder="Nombre" onChange={e => setForm({...form, nombre: e.target.value})} required />
                  <input placeholder="DNI" onChange={e => setForm({...form, dni: e.target.value})} required />
                  <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} required />
                  <input type="password" placeholder="Pass" onChange={e => setForm({...form, contrasena: e.target.value})} required />
                </>
              )}
              {tab === 'piezas' && (
                <>
                  <input placeholder="Nombre" onChange={e => setForm({...form, nombre: e.target.value})} required />
                  <input placeholder="Precio" type="number" onChange={e => setForm({...form, precio: e.target.value})} required />
                  <input placeholder="Stock" type="number" onChange={e => setForm({...form, stock: e.target.value})} required />
                </>
              )}
              <button className="btn-black">Añadir</button>
            </form>
          </div>
        )}

        {/* Tabla de Resultados */}
        <div className="card">
          <table>
            <thead>
              {tab === 'vehiculos' && <tr><th>Matrícula</th><th>Marca</th><th>Modelo</th></tr>}
              {tab === 'empleados' && <tr><th>DNI</th><th>Nombre</th><th>Email</th></tr>}
              {tab === 'clientes' && <tr><th>Nombre</th><th>Email</th><th>DNI</th></tr>}
              {tab === 'piezas' && <tr><th>Pieza</th><th>Stock</th><th>Precio</th></tr>}
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i}>
                  {tab === 'vehiculos' && <><td><b>{item.matricula}</b></td><td>{item.marca}</td><td>{item.modelo}</td></>}
                  {tab === 'empleados' && <><td>{item.dni}</td><td>{item.nombre}</td><td>{item.email}</td></>}
                  {tab === 'clientes' && <><td>{item.nombre}</td><td>{item.email}</td><td>{item.dni}</td></>}
                  {tab === 'piezas' && <><td>{item.nombre}</td><td>{item.stock} uds</td><td>{item.precio}€</td></>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;