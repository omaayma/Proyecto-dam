package com.taller.Taller.modelo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
public class Cliente {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String nombre;
private String apellidos;

@Column(unique = true, nullable = false)
private String dni;

private String telefono;
private String email;
private String direccion;

private String rol = "CLIENTE";

@OneToMany(mappedBy = "cliente")
@JsonIgnore
private List<Vehiculo> vehiculos;

@ManyToOne
private Administrador administrador;

public Cliente(){}

public Long getId(){
	return id;
}

public void setId(Long id){
	this.id=id;
}

public String getNombre(){
	return nombre;
}

public void setNombre(String nombre){
	this.nombre=nombre;
}


public String getApellidos() {
	return apellidos;
}

public void setApellidos(String apellidos) {
	this.apellidos = apellidos;
}

public String getDni() {
	return dni;
}

public void setDni(String dni) {
	this.dni = dni;
}

public String getTelefono(){
	return telefono;
}

public void setTelefono(String telefono){
	this.telefono=telefono;
}

public String getEmail(){
	return email;
}

public void setEmail(String email){
	this.email=email;
}

public String getDireccion(){
	return direccion;
}

public void setDireccion(String direccion){
	this.direccion=direccion;
}

public String getRol() {
	return rol;
}

public void setRol(String rol) {
	this.rol = rol;
}



}
