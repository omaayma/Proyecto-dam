# Backend – W&O AutoGroup


Este directorio contiene el backend del proyecto **W&O AutoGroup**, desarrollado como parte del Trabajo Fin de Ciclo (TFC) del ciclo formativo de **Desarrollo de Aplicaciones Multiplataforma (DAM)**.


El backend se encarga de la lógica de negocio, la gestión de datos y la exposición de una **API REST** consumida por el frontend del proyecto.


---


## Tecnologías utilizadas


- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- Maven


---


## Arquitectura


El backend sigue una arquitectura basada en servicios REST, actuando como servidor dentro de un modelo **cliente-servidor**.
Expone distintos endpoints HTTP que permiten al frontend realizar operaciones CRUD sobre las entidades del sistema.


Los datos se intercambian en formato **JSON**.


---


## Endpoints disponibles


### Vehículos
- **GET /vehiculos**
  Obtiene el listado de vehículos almacenados en la base de datos.
- **POST /vehiculos**
  Crea un nuevo vehículo.


### Clientes
- **GET /clientes**
  Obtiene el listado de clientes.
- **POST /clientes**
  Crea un nuevo cliente.


### Empleados
- **GET /empleados**
  Obtiene el listado de empleados.
- **POST /empleados**
  Crea un nuevo empleado.


---


## Base de datos


El backend utiliza una base de datos **MySQL** para la persistencia de la información.
Las tablas se generan automáticamente a partir de las entidades definidas en el proyecto mediante **JPA/Hibernate**.


---


## Puesta en marcha del backend


### Requisitos previos
- Java JDK
- MySQL
- Maven
- IntelliJ IDEA (recomendado)


### Pasos para ejecutar el backend


1. Acceder al directorio `backend`.
2. Abrir el proyecto en IntelliJ IDEA.
3. Configurar la conexión a la base de datos MySQL en el archivo `application.properties`.
4. Ejecutar la clase principal: `TallerApplication.java`
 