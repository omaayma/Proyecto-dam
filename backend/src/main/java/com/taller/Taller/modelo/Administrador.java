package com.taller.Taller.modelo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String dni;
    private String telefono;
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String contrasena;

    private String rol = "ADMIN";

    @OneToMany(mappedBy = "administrador")
    @JsonIgnore
    private List<Empleado> empleados;

    @OneToMany(mappedBy = "administrador")
    @JsonIgnore
    private List<Cliente> clientes;

    public Administrador() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getRol() { return rol; }
}
