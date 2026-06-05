import React, { useState } from 'react'
 

const t = {
  es: {
    navServicios: 'Servicios',
    navFlujo: 'Cómo funciona',
    navProyecto: 'Proyecto',
    navContacto: 'Contacto',
    navLogin: 'Iniciar sesión',
 

    heroKicker: 'W&O AUTOGROUP',
    heroTitle1: 'Cuidamos tu coche',
    heroTitle2: 'como si fuera',
    heroTitle3: 'nuestro',
    heroBtnPrimary: 'Crear cuenta',
    heroBtnSecondary: 'Ya tengo cuenta',
    heroFeature1: 'Diagnóstico rápido',
    heroFeature2: 'Sin esperas',
    heroFeature3: 'Transparencia total',
 

    serviciosKicker: 'Servicios',
    serviciosTitle: 'Nuestros servicios',
    servicios: [
      ['🔧', 'Reparación mecánica', 'Averías, revisiones y reparación general del vehículo.'],
      ['🛞', 'Neumáticos', 'Cambio, equilibrado y revisión de desgaste.'],
      ['🛢️', 'Mantenimiento', 'Aceite, filtros, correas y revisiones periódicas.'],
      ['📋', 'Presupuestos', 'Solicitud online con respuesta clara y organizada.'],
      ['📅', 'Cita online', 'Reserva tu cita desde la plataforma sin llamadas.'],
      ['🧾', 'Facturación', 'Consulta y descarga tus facturas cuando quieras.'],
    ],
 

    flujoKicker: 'Cómo funciona',
    flujoTitle: 'Una experiencia simple y clara',
    pasos: [
      ['01', 'Registra tu vehículo'],
      ['02', 'Solicita tu cita'],
      ['03', 'Sigue el servicio'],
    ],
 

    proyectoKicker: 'Proyecto',
    proyectoTitle: 'Detrás de W&O',
    proyectoText:
      'Un proyecto de DAM pensado para digitalizar la gestión de talleres con una imagen más profesional, moderna y cercana.',
    omaymaRole: 'Backend & lógica',
    omaymaDesc: 'Parte funcional, lógica de negocio y estructura de datos.',
    wasimaRole: 'Frontend & diseño',
    wasimaDesc: 'Interfaz, experiencia visual e identidad de la aplicación.',
 

    contactoKicker: 'Contacto',
    contactoTitle: 'Contacto',
    emailLabel: 'Email',
    phoneLabel: 'Teléfono',
    hoursLabel: 'Horario',
    hoursValue: 'Lunes a viernes · 9:00 – 19:00',
 

    ctaKicker: 'Empieza hoy',
    ctaTitle: 'Gestiona tu taller con una experiencia más visual',
    ctaText: 'Regístrate gratis y accede a una forma más clara y profesional de trabajar.',
    footerRights: '© 2026 W&O Autogroup · Todos los derechos reservados',
    footerDev: 'Desarrollado por Omayma Zemmouri y Wasima El Ouastani · Proyecto DAM 2026',
  },
 

  en: {
    navServicios: 'Services',
    navFlujo: 'How it works',
    navProyecto: 'Project',
    navContacto: 'Contact',
    navLogin: 'Log in',
 

    heroKicker: 'W&O AUTOGROUP',
    heroTitle1: 'We take care of your car',
    heroTitle2: 'as if it were',
    heroTitle3: 'our own',
    heroBtnPrimary: 'Create account',
    heroBtnSecondary: 'I already have one',
    heroFeature1: 'Fast diagnosis',
    heroFeature2: 'No waiting',
    heroFeature3: 'Full transparency',
 

    serviciosKicker: 'Services',
    serviciosTitle: 'Our services',
    servicios: [
      ['🔧', 'Mechanical repair', 'Breakdowns, inspections and general vehicle repair.'],
      ['🛞', 'Tyres', 'Replacement, balancing and wear inspection.'],
      ['🛢️', 'Maintenance', 'Oil, filters, belts and regular inspections.'],
      ['📋', 'Quotes', 'Online request with a clear and organised response.'],
      ['📅', 'Online booking', 'Book your appointment through the platform.'],
      ['🧾', 'Invoicing', 'View and download your invoices anytime.'],
    ],
 

    flujoKicker: 'How it works',
    flujoTitle: 'A simple and clear experience',
    pasos: [
      ['01', 'Register your vehicle'],
      ['02', 'Request your booking'],
      ['03', 'Track the service'],
    ],
 

    proyectoKicker: 'Project',
    proyectoTitle: 'Behind W&O',
    proyectoText:
      'A DAM project designed to digitalise workshop management with a more modern, professional and human visual identity.',
    omaymaRole: 'Backend & logic',
    omaymaDesc: 'Functional structure, business logic and data layer.',
    wasimaRole: 'Frontend & design',
    wasimaDesc: 'Interface, visual experience and application identity.',
 

    contactoKicker: 'Contact',
    contactoTitle: 'Contact',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    hoursLabel: 'Hours',
    hoursValue: 'Monday to Friday · 9:00 – 19:00',
 

    ctaKicker: 'Start today',
    ctaTitle: 'Manage your workshop with a more visual experience',
    ctaText: 'Register for free and discover a clearer and more professional way of working.',
    footerRights: '© 2026 W&O Autogroup · All rights reserved',
    footerDev: 'Developed by Omayma Zemmouri and Wasima El Ouastani · DAM Project 2026',
  },
}
 

function FounderCard({ imageSrc, fallback, role, name, desc }) {
  const [imgError, setImgError] = useState(false)
 

  return (
    <article className="landing-founder-card">
      <div className="landing-founder-photo-wrap">
        {!imgError ? (
          <img
            src={imageSrc}
            alt={name}
            className="landing-founder-photo"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="landing-founder-fallback">{fallback}</div>
        )}
      </div>
 

      <span className="landing-founder-role">{role}</span>
      <h3>{name}</h3>
      <p>{desc}</p>
    </article>
  )
}
 

function Landing({ onLogin, onRegister, idioma }) {
  const tx = t[idioma] || t.es
 

  return (
    <div className="landing-wrapper">
      <div className="landing-bg-blur landing-bg-blur-red" />
      <div className="landing-bg-blur landing-bg-blur-dark" />
 

      <nav className="landing-nav">
        <a href="#top" className="landing-brand">
          <img src="/logo.png" alt="W&O Autogroup" className="landing-logo" />
        </a>
 

        <div className="landing-nav-links">
          <a href="#servicios">{tx.navServicios}</a>
          <a href="#flujo">{tx.navFlujo}</a>
          <a href="#proyecto">{tx.navProyecto}</a>
          <a href="#contacto">{tx.navContacto}</a>
        </div>
 

        <button className="landing-btn-nav" onClick={onLogin}>
          {tx.navLogin}
        </button>
      </nav>
 

      <main id="top">
        <section className="landing-hero">
          <div className="landing-hero-overlay" />
 

          <div className="landing-hero-content">
            <h1 className="landing-hero-title">
              <span>{tx.heroTitle1}</span>
              <span>{tx.heroTitle2}</span>
              <span className="landing-hero-title-accent">{tx.heroTitle3}</span>
            </h1>
 

            <div className="landing-hero-actions">
              <button className="landing-btn-primary" onClick={onRegister}>
                {tx.heroBtnPrimary}
              </button>
              <button className="landing-btn-secondary" onClick={onLogin}>
                {tx.heroBtnSecondary}
              </button>
            </div>
 

            <div className="landing-hero-features">
              <span>✔ {tx.heroFeature1}</span>
              <span>✔ {tx.heroFeature2}</span>
              <span>✔ {tx.heroFeature3}</span>
            </div>
          </div>
        </section>
 

        <section className="landing-servicios" id="servicios">
          <div className="landing-section-head">
            <span>{tx.serviciosKicker}</span>
            <h2>{tx.serviciosTitle}</h2>
          </div>
 

          <div className="landing-services-grid">
            {tx.servicios.map(([icon, title, desc], index) => (
              <article
                className={`landing-service-card service-${index}`}
                key={title}
              >
                <div className="landing-service-icon">
                  {icon}
                </div>

                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>
 

        <section className="landing-flow" id="flujo">
          <div className="landing-section-head">
            <span>{tx.flujoKicker}</span>
            <h2>{tx.flujoTitle}</h2>
          </div>
 

          <div className="landing-flow-track">
            {tx.pasos.map(([num, title], index) => (
              <div className="landing-flow-step" key={num}>
                <div className="landing-flow-node">{num}</div>
                <div className="landing-flow-card">
                  <h3>{title}</h3>
                </div>
                {index !== tx.pasos.length - 1 && <div className="landing-flow-line" />}
              </div>
            ))}
          </div>
        </section>
 

        <section className="landing-project" id="proyecto">
          <div className="landing-section-head">
            <span>{tx.proyectoKicker}</span>
            <h2>{tx.proyectoTitle}</h2>
            <p>{tx.proyectoText}</p>
          </div>
 

          <div className="landing-founders">
            <FounderCard
              imageSrc="/omayma.jpg"
              fallback="O"
              role={tx.omaymaRole}
              name="Omayma Zemmouri"
              desc={tx.omaymaDesc}
            />
 

            <FounderCard
              imageSrc="/wasima.png"
              fallback="W"
              role={tx.wasimaRole}
              name="Wasima El Ouastani"
              desc={tx.wasimaDesc}
            />
          </div>
        </section>
 

        <section className="landing-contact" id="contacto">
          <div className="landing-section-head">
            <span>{tx.contactoKicker}</span>
            <h2>{tx.contactoTitle}</h2>
          </div>
 

          <div className="landing-contact-grid">
            <div className="landing-contact-card">
              <div className="landing-contact-icon">✉️</div>
              <div>
                <strong>{tx.emailLabel}</strong>
                <a href="mailto:admin@wo.com">admin@wo.com</a>
              </div>
            </div>
 

            <div className="landing-contact-card">
              <div className="landing-contact-icon">📞</div>
              <div>
                <strong>{tx.phoneLabel}</strong>
                <a href="tel:+34604914588">604 91 45 88</a>
              </div>
            </div>
 

            <div className="landing-contact-card">
              <div className="landing-contact-icon">🕐</div>
              <div>
                <strong>{tx.hoursLabel}</strong>
                <span>{tx.hoursValue}</span>
              </div>
            </div>
          </div>
        </section>
 

        <section className="landing-cta">
          <div className="landing-cta-box">
            <span>{tx.ctaKicker}</span>
            <h2>{tx.ctaTitle}</h2>
            <p>{tx.ctaText}</p>
            <button className="landing-btn-primary landing-btn-primary-cta" onClick={onRegister}>
              {tx.heroBtnPrimary}
            </button>
          </div>
        </section>
      </main>
 

      <footer className="landing-footer">
        <div className="landing-footer-left">
          <img src="/logo.png" alt="W&O" className="landing-footer-logo" />
          <div>
            <p>{tx.footerRights}</p>
            <p className="landing-footer-dev">{tx.footerDev}</p>
          </div>
        </div>
 

        <div className="landing-footer-links">
          <a href="#servicios">{tx.navServicios}</a>
          <a href="#flujo">{tx.navFlujo}</a>
          <a href="#proyecto">{tx.navProyecto}</a>
          <a href="#contacto">{tx.navContacto}</a>
        </div>
      </footer>
    </div>
  )
}
 

export default Landing
