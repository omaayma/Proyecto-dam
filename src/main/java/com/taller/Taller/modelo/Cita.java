package com.taller.Taller.modelo;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Cita {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private LocalDate fecha;
@Column(columnDefinition = "TIME")
private LocalTime hora;
private String descripcion;
private String estado;

@ManyToOne
@JoinColumn(name = "vehiculo_id")
@JsonIgnore
private Vehiculo vehiculo;

@ManyToOne
@JoinColumn(name = "empleado_id")
private Empleado empleado;

public Cita(){}

public Long getId(){
	return id;
}

public void setId(Long id){
	this.id=id;
}

public LocalDate getFecha(){
	return fecha;
}

public void setFecha(LocalDate fecha){
	this.fecha=fecha;
}

public LocalTime getHora(){
	return hora;
}

public void setHora(LocalTime hora){
	this.hora=hora;
}

public String getDescripcion(){
	return descripcion;
}

public void setDescripcion(String descripcion){
	this.descripcion=descripcion;
}

public String getEstado(){
	return estado;
}

public void setEstado(String estado){
	this.estado=estado;
}

public Vehiculo getVehiculo(){
	return vehiculo;
}

public void setVehiculo(Vehiculo vehiculo){
	this.vehiculo=vehiculo;
}

public Empleado getEmpleado(){
	return empleado;
}

public void setEmpleado(Empleado empleado){
	this.empleado=empleado;
}

}
