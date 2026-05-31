import React from 'react'

const t = {
  es: {
    navLogin:      'Iniciar sesión',
    heroH1:        'Tu taller de confianza',
    heroP1:        'En W&O Autogroup ponemos a tu disposición el mejor servicio mecánico. Revisiones, reparaciones y presupuestos sin sorpresas.',
    heroP2:        'Cada vehículo que entra en nuestro taller recibe un diagnóstico detallado, un presupuesto claro y un seguimiento completo hasta la entrega. Sin letra pequeña, sin costes ocultos. Porque la transparencia y la calidad no son opcionales para nosotras.',
    btnPrimary:    'Crear cuenta gratuita',
    btnSecondary:  'Ya tengo cuenta',
    serviciosH2:   '¿Qué hacemos?',
    servicios: [
      ['🔧','Reparación mecánica','Diagnóstico y reparación de todo tipo de averías en vehículos de cualquier marca.'],
      ['🛞','Cambio de neumáticos','Servicio rápido de montaje y equilibrado de neumáticos con las mejores marcas.'],
      ['🛢️','Mantenimiento','Cambios de aceite, filtros, correas y revisiones periódicas para mantener tu coche a punto.'],
      ['📋','Presupuesto sin compromiso','Solicita tu presupuesto online y te contactamos en menos de 24 horas.'],
      ['📅','Cita online','Reserva tu cita desde la aplicación y olvídate de esperas innecesarias.'],
      ['🧾','Facturación digital','Consulta y descarga tus facturas desde tu perfil en cualquier momento.'],
    ],
    nosotrasH2:    'Sobre nosotras',
    nosotrasIntro: 'W&O Autogroup es un proyecto desarrollado con ilusión y dedicación por dos estudiantes de Desarrollo de Aplicaciones Multiplataforma.',
    omaymaDesc:    'Responsable de la lógica de negocio y la gestión de datos de W&O.',
    wasimaDesc:    'Responsable del frontend y la arquitectura visual de W&O.',
    nosotrasFooter:'Este proyecto nació como trabajo de fin de curso del ciclo DAM y representa nuestra visión de cómo debería ser la gestión digital de un taller mecánico moderno.',
    contactoH2:    'Contacto',
    contactoP:     '¿Tienes alguna pregunta o quieres saber más sobre nuestros servicios? Estamos aquí para ayudarte.',
    emailLabel:    'Email',
    telefonoLabel: 'Teléfono',
    horarioLabel:  'Horario',
    horarioVal:    'Lunes a viernes · 9:00 – 19:00',
    ctaH2:         '¿Eres cliente nuevo?',
    ctaP:          'Regístrate gratis y gestiona tu vehículo, citas y facturas desde cualquier dispositivo.',
    footerRights:  '© 2026 W&O Autogroup · Todos los derechos reservados',
    footerDev:     'Desarrollado por Omayma Zemmouri y Wasima El Ouastani · Proyecto DAM 2026',
  },
  en: {
    navLogin:      'Log in',
    heroH1:        'Your trusted garage',
    heroP1:        'At W&O Autogroup we offer you the best mechanical service. Inspections, repairs and quotes with no surprises.',
    heroP2:        'Every vehicle that comes into our workshop receives a detailed diagnosis, a clear quote and full follow-up until delivery. No small print, no hidden costs. Because transparency and quality are non-negotiable for us.',
    btnPrimary:    'Create free account',
    btnSecondary:  'I already have an account',
    serviciosH2:   'What do we do?',
    servicios: [
      ['🔧','Mechanical repair','Diagnosis and repair of all kinds of breakdowns in vehicles of any brand.'],
      ['🛞','Tyre change','Fast tyre fitting and balancing service with the best brands.'],
      ['🛢️','Maintenance','Oil changes, filters, belts and regular inspections to keep your car in top condition.'],
      ['📋','No-obligation quote','Request your quote online and we will contact you within 24 hours.'],
      ['📅','Online booking','Book your appointment from the app and forget about unnecessary waiting.'],
      ['🧾','Digital invoicing','View and download your invoices from your profile at any time.'],
    ],
    nosotrasH2:    'About us',
    nosotrasIntro: 'W&O Autogroup is a project developed with enthusiasm and dedication by two Multiplatform Application Development students.',
    omaymaDesc:    'Responsible for the business logic and data management of W&O.',
    wasimaDesc:    'Responsible for the frontend and visual architecture of W&O.',
    nosotrasFooter:'This project was born as a final-year project for the DAM degree and represents our vision of what digital management of a modern garage should look like.',
    contactoH2:    'Contact',
    contactoP:     'Do you have any questions or want to know more about our services? We are here to help.',
    emailLabel:    'Email',
    telefonoLabel: 'Phone',
    horarioLabel:  'Opening hours',
    horarioVal:    'Monday to Friday · 9:00 – 19:00',
    ctaH2:         'Are you a new customer?',
    ctaP:          'Register for free and manage your vehicle, appointments and invoices from any device.',
    footerRights:  '© 2026 W&O Autogroup · All rights reserved',
    footerDev:     'Developed by Omayma Zemmouri and Wasima El Ouastani · DAM Project 2026',
  }
}

function Landing({ onLogin, onRegister, idioma }) {
  const tx = t[idioma] || t['es']

  return (
    <div className="landing-wrapper">

      <nav className="landing-nav">
        <img src="/logo.png" alt="W&O Autogroup" className="landing-logo" />
        <button className="landing-btn-nav" onClick={onLogin}>{tx.navLogin}</button>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>{tx.heroH1}</h1>
          <p>{tx.heroP1}</p>
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.7', marginBottom: '36px' }}>{tx.heroP2}</p>
          <div className="landing-hero-btns">
            <button className="landing-btn-primary"   onClick={onRegister}>{tx.btnPrimary}</button>
            <button className="landing-btn-secondary" onClick={onLogin}>{tx.btnSecondary}</button>
          </div>
        </div>
      </section>

      <section className="landing-servicios" id="servicios">
        <h2>{tx.serviciosH2}</h2>
        <div className="landing-cards">
          {tx.servicios.map(([icon, titulo, desc]) => (
            <div className="landing-card" key={titulo}>
              <div className="landing-card-icon">{icon}</div>
              <h3>{titulo}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-nosotras" id="nosotras">
        <h2>{tx.nosotrasH2}</h2>
        <p className="landing-nosotras-intro">{tx.nosotrasIntro}</p>
        <div className="landing-nosotras-cards">
          <div className="landing-nosotras-card">
            <div className="landing-nosotras-avatar">O</div>
            <h3>Omayma Zemmouri</h3>
            <p>{tx.omaymaDesc}</p>
          </div>
          <div className="landing-nosotras-card">
            <div className="landing-nosotras-avatar">W</div>
            <h3>Wasima El Ouastani</h3>
            <p>{tx.wasimaDesc}</p>
          </div>
        </div>
        <p className="landing-nosotras-footer">{tx.nosotrasFooter}</p>
      </section>

      <section className="landing-contacto" id="contacto">
        <h2>{tx.contactoH2}</h2>
        <p>{tx.contactoP}</p>
        <div className="landing-contacto-grid">
          <div className="landing-contacto-item">
            <span className="landing-contacto-icon">✉️</span>
            <div>
              <strong>{tx.emailLabel}</strong>
              <a href="mailto:admin@wo.com">admin@wo.com</a>
            </div>
          </div>
          <div className="landing-contacto-item">
            <span className="landing-contacto-icon">📞</span>
            <div>
              <strong>{tx.telefonoLabel}</strong>
              <a href="tel:+34604914588">604 91 45 88</a>
            </div>
          </div>
          <div className="landing-contacto-item">
            <span className="landing-contacto-icon">🕐</span>
            <div>
              <strong>{tx.horarioLabel}</strong>
              <span>{tx.horarioVal}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <h2>{tx.ctaH2}</h2>
        <p>{tx.ctaP}</p>
        <button className="landing-btn-primary" style={{ fontSize: '16px', padding: '14px 36px' }} onClick={onRegister}>
          {tx.btnPrimary}
        </button>
      </section>

      <footer className="landing-footer">
        <img src="/logo.png" alt="W&O" style={{ height: '36px', objectFit: 'contain', opacity: 0.6 }} />
        <div>
          <p>{tx.footerRights}</p>
          <p style={{ fontSize: '12px', opacity: 0.5, marginTop: '4px' }}>{tx.footerDev}</p>
        </div>
      </footer>

    </div>
  )
}

export default Landing