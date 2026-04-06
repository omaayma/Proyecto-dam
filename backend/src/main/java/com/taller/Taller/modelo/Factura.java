package com.taller.Taller.modelo;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;

@Entity
public class Factura {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private LocalDate fecha;
private double total;

@OneToOne
@JoinColumn(name = "presupuesto_id")
private Presupuesto presupuesto;

@ManyToMany
@JoinTable(
    name = "factura_pieza",
    joinColumns = @JoinColumn(name = "factura_id"),
    inverseJoinColumns = @JoinColumn(name = "pieza_id")
)
private List<Pieza> piezas;

public Factura(){}

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

public Presupuesto getPresupuesto(){
    return presupuesto;
}

public void setPresupuesto(Presupuesto presupuesto){
    this.presupuesto=presupuesto;
}

public List<Pieza> getPiezas(){
    return piezas;
}

public void setPiezas(List<Pieza> piezas){
    this.piezas=piezas;
}

}
