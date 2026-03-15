package com.taller.Taller.modelo;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class Presupuesto {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private LocalDate fecha;
private double total;
private String estado;

@ManyToOne
@JoinColumn(name = "vehiculo_id")
private Vehiculo vehiculo;

@OneToOne(mappedBy = "presupuesto")
private Factura factura;

public Presupuesto(){}

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

public double getTotal(){
    return total;
}

public void setTotal(double total){
    this.total=total;
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

public Factura getFactura(){
    return factura;
}

public void setFactura(Factura factura){
    this.factura=factura;
}

}
