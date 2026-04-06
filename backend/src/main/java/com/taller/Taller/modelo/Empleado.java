package com.taller.Taller.modelo;

import java.util.List;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    
    @Column(unique = true, nullable = false)
    private String dni;
    
    private String puesto;
    private String telefono;
    private String email;
    
    private String rol = "EMPLEADO";
    
    public Empleado() {}

    public Empleado(String nombre, String puesto, String telefono, String email) {
        this.nombre = nombre;
        this.puesto = puesto;
        this.telefono = telefono;
        this.email = email;
    }
    @OneToMany(mappedBy = "empleado")
    @JsonIgnore
    private List<Cita> citas;
    
    @ManyToOne
    private Administrador administrador;

    public void setId(Long id) {
        this.id = id;
    }
    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    

    public String getDni() {
		return dni;
	}

	public void setDni(String dni) {
		this.dni = dni;
	}

	public String getPuesto() {
        return puesto;
    }

    public void setPuesto(String puesto) {
        this.puesto = puesto;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

	public String getRol() {
		return rol;
	}

	public void setRol(String rol) {
		this.rol = rol;
	}
    
    
}
