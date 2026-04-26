package com.taller.Taller.modelo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
public class Vehiculo {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

@Column(unique = true)
private String matricula;

private String marca;
private String modelo;
private int anio;

@ManyToOne
@JoinColumn(name = "cliente_id")
private Cliente cliente;

@OneToMany(mappedBy = "vehiculo")
@JsonIgnore
private List<Cita> citas;

@OneToMany(mappedBy = "vehiculo")
@JsonIgnore
private List<Presupuesto> presupuestos;

public Vehiculo(){}

public Long getId(){
	return id;
}

public void setId(Long id){
	this.id=id;
}

public String getMatricula(){
	return matricula;
}

public void setMatricula(String matricula){
	this.matricula=matricula;
}

public String getMarca(){
	return marca;
}

public void setMarca(String marca){
	this.marca=marca;
}

public String getModelo(){
	return modelo;
}

public void setModelo(String modelo){
	this.modelo=modelo;
}

public int getAnio(){
	return anio;
}

public void setAnio(int anio){
	this.anio=anio;
}

public Cliente getCliente(){
	return cliente;
}

public void setCliente(Cliente cliente){
	this.cliente=cliente;
}

}
