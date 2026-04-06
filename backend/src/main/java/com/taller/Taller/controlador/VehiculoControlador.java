package com.taller.Taller.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.taller.Taller.modelo.Vehiculo;
import com.taller.Taller.servicio.ServicioVehiculo;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoControlador {

@Autowired
private ServicioVehiculo vehiculoServicio;

@GetMapping
public List<Vehiculo> listar(){
	return vehiculoServicio.listar();
}

@GetMapping("/{id}")
public Vehiculo obtener(@PathVariable Long id){
	return vehiculoServicio.obtener(id);
}

@PostMapping
public Vehiculo guardar(@RequestBody Vehiculo vehiculo){
	return vehiculoServicio.guardar(vehiculo);
}

@PutMapping("/{id}")
public Vehiculo actualizar(@PathVariable Long id, @RequestBody Vehiculo vehiculo){
	vehiculo.setId(id);
	return vehiculoServicio.guardar(vehiculo);
}

@DeleteMapping("/{id}")
public void eliminar(@PathVariable Long id){
	vehiculoServicio.eliminar(id);
}

}
