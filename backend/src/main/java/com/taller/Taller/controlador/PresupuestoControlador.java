package com.taller.Taller.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.taller.Taller.modelo.Presupuesto;
import com.taller.Taller.servicio.ServicioPresupuesto;

@RestController
@RequestMapping("api/presupuestos")
@CrossOrigin(origins = "*")
public class PresupuestoControlador {

@Autowired
private ServicioPresupuesto presupuestoServicio;

@GetMapping
public List<Presupuesto> listar(){
	return presupuestoServicio.listar();
}

@PostMapping
public Presupuesto guardar(@RequestBody Presupuesto presupuesto){
	return presupuestoServicio.guardar(presupuesto);
}

@GetMapping("/{id}")
public Presupuesto obtener(@PathVariable Long id){
	return presupuestoServicio.obtener(id);
}

@PutMapping("/{id}")
public Presupuesto actualizar(@PathVariable Long id, @RequestBody Presupuesto presupuesto){
	presupuesto.setId(id);
	return presupuestoServicio.guardar(presupuesto);
}

@DeleteMapping("/{id}")
public void eliminar(@PathVariable Long id){
	presupuestoServicio.eliminar(id);
}

}