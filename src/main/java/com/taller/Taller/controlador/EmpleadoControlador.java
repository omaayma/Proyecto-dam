package com.taller.Taller.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.taller.Taller.modelo.Empleado;
import com.taller.Taller.servicio.ServicioEmpleado;

@RestController
@RequestMapping("/empleados")
public class EmpleadoControlador {

@Autowired
private ServicioEmpleado empleadoServicio;

@GetMapping
public List<Empleado> listar(){
	return empleadoServicio.listar();
}

@GetMapping("/{id}")
public Empleado obtener(@PathVariable Long id){
	return empleadoServicio.obtener(id);
}

@PostMapping
public Empleado guardar(@RequestBody Empleado empleado){
	return empleadoServicio.guardar(empleado);
}

@PutMapping("/{id}")
public Empleado actualizar(@PathVariable Long id, @RequestBody Empleado empleado){
	empleado.setId(id);
	return empleadoServicio.guardar(empleado);
}

@DeleteMapping("/{id}")
public void eliminar(@PathVariable Long id){
	empleadoServicio.eliminar(id);
}

}