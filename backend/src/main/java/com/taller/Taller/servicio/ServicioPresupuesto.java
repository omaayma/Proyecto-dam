package com.taller.Taller.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taller.Taller.modelo.Presupuesto;
import com.taller.Taller.repositorio.RepositorioPresupuesto;

@Service
public class ServicioPresupuesto {

@Autowired
private RepositorioPresupuesto presupuestoRepositorio;

public List<Presupuesto> listar(){
	return presupuestoRepositorio.findAll();
}

public Presupuesto guardar(Presupuesto presupuesto){
	return presupuestoRepositorio.save(presupuesto);
}

public Presupuesto obtener(Long id){
	return presupuestoRepositorio.findById(id).orElse(null);
}

public void eliminar(Long id){
	presupuestoRepositorio.deleteById(id);
}

}
