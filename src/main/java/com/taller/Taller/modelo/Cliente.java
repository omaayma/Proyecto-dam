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
private String apellido;
private String telefono;
private String email;
private String direccion;

@OneToMany(mappedBy = "cliente")
@JsonIgnore
private List<Vehiculo> vehiculos;

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

public String getApellido(){
	return apellido;
}

public void setApellido(String apellido){
	this.apellido=apellido;
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

}
