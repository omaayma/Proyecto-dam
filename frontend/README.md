# Frontend – W&O AutoGroup

## Descripción del proyecto

Este directorio contiene el desarrollo del **frontend** de la aplicación **W&O AutoGroup**, realizado como parte del **Trabajo de Fin de Ciclo (TFC)** del ciclo formativo de **Desarrollo de Aplicaciones Multiplataforma (DAM)**.

La aplicación cliente ha sido desarrollada utilizando **React** junto con **Vite** como herramienta de construcción y empaquetado, permitiendo una interfaz moderna, modular y eficiente para la interacción con el sistema de gestión empresarial del concesionario automovilístico.

El frontend se comunica con el backend mediante una **API REST**, facilitando el intercambio de información y la ejecución de operaciones relacionadas con la gestión de vehículos, clientes y empleados.

## Objetivos del frontend

El objetivo principal de esta aplicación es proporcionar una interfaz gráfica intuitiva y funcional que permita la interacción con los distintos recursos gestionados por el sistema, garantizando una experiencia de usuario clara y un acceso estructurado a la información.

Entre los objetivos específicos destacan:

* Facilitar la visualización de información almacenada en el sistema.
* Permitir el registro de nuevos elementos mediante formularios interactivos.
* Integrar el consumo de servicios REST para la comunicación con el backend.
* Aplicar una arquitectura modular basada en componentes reutilizables.

## Tecnologías utilizadas

El desarrollo del frontend se ha llevado a cabo utilizando las siguientes tecnologías:

* **React**: biblioteca JavaScript orientada al desarrollo de interfaces de usuario basadas en componentes.
* **Vite**: entorno de desarrollo y herramienta de construcción optimizada para aplicaciones frontend modernas.
* **JavaScript (ES6+)**: lenguaje principal empleado para la lógica de la aplicación.
* **Axios**: librería utilizada para la realización de peticiones HTTP hacia la API REST.
* **HTML5 y CSS3**: tecnologías empleadas para la estructura y el diseño visual de la interfaz.
* **Node.js y npm**: entorno de ejecución y gestor de dependencias del proyecto.

## Funcionalidades implementadas

Actualmente, el frontend incorpora las siguientes funcionalidades operativas:

### Gestión de vehículos

* Consulta del listado de vehículos registrados.
* Registro de nuevos vehículos en el sistema.

### Gestión de clientes

* Consulta del listado de clientes registrados.
* Registro de nuevos clientes en el sistema.

### Gestión de empleados

* Consulta del listado de empleados registrados.
* Registro de nuevos empleados en el sistema.

Todas las funcionalidades descritas se ejecutan mediante **peticiones HTTP al backend**, permitiendo la persistencia y recuperación de datos de forma dinámica.

## Arquitectura y estructura del proyecto

La organización del proyecto sigue una estructura modular orientada a la separación de responsabilidades, favoreciendo la mantenibilidad, reutilización de componentes y escalabilidad de la aplicación.

```plaintext
frontend/
│── src/
│   ├── components/      # Componentes reutilizables de la interfaz
│   ├── services/        # Gestión de peticiones HTTP a la API
│   ├── App.jsx          # Componente principal de la aplicación
│   └── main.jsx         # Punto de entrada de React
│── public/              # Recursos estáticos
│── package.json         # Dependencias y scripts del proyecto
│── vite.config.js       # Configuración de Vite
└── README.md
```

## Requisitos previos

Para la correcta ejecución del frontend, es necesario disponer previamente de las siguientes herramientas instaladas en el entorno de desarrollo:

* **Node.js**
* **npm (Node Package Manager)**

Se recomienda verificar su instalación ejecutando los siguientes comandos:

```bash
node -v
npm -v
```

## Procedimiento de instalación y ejecución

Para desplegar el frontend en un entorno local de desarrollo, se deben seguir los pasos indicados a continuación:

### 1. Clonación del repositorio

```bash
git clone (https://github.com/omaayma/Proyecto-dam)
```

### 2. Acceso al directorio del proyecto

```bash
cd frontend
```

### 3. Instalación de dependencias

Ejecutar el siguiente comando para instalar todas las librerías necesarias del proyecto:

```bash
npm install
```

### 4. Ejecución del entorno de desarrollo

Iniciar el servidor de desarrollo mediante:

```bash
npm run dev
```

### 5. Acceso a la aplicación

Una vez iniciado el servidor, la aplicación estará disponible desde el navegador en una dirección similar a:

```plaintext
http://localhost:5173
```

## Integración con el backend

El correcto funcionamiento del frontend depende de la disponibilidad del backend del proyecto, ya que todas las operaciones de consulta y persistencia de datos se realizan a través de una **API REST**.

Por tanto, antes de iniciar el frontend, se deberá comprobar que el servidor backend se encuentra correctamente desplegado y operativo.

## Consideraciones técnicas

El frontend ha sido diseñado siguiendo un enfoque basado en componentes, promoviendo la reutilización del código y la separación de responsabilidades. Asimismo, la utilización de React y Vite permite optimizar el rendimiento de desarrollo y mejorar la mantenibilidad del sistema.

La comunicación con el backend se realiza mediante peticiones asíncronas HTTP, favoreciendo una actualización dinámica de la interfaz sin necesidad de recargar la página.

## Autoría

Proyecto desarrollado como parte del **Trabajo de Fin de Ciclo (TFC)** del ciclo formativo de **Desarrollo de Aplicaciones Multiplataforma (DAM)**.
