package com.taller.Taller.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.taller.Taller.modelo.Cita;
import com.taller.Taller.servicio.ServicioCita;

@RestController
@RequestMapping("/citas")
public class CitaControlador {

@Autowired
private ServicioCita citaServicio;

@GetMapping
public List<Cita> listar(){
	return citaServicio.listar();
}

@GetMapping("/{id}")
public Cita obtener(@PathVariable Long id){
	return citaServicio.obtener(id);
}

@PostMapping
public Cita guardar(@RequestBody Cita cita){
	return citaServicio.guardar(cita);
}

@PutMapping("/{id}")
public Cita actualizar(@PathVariable Long id, @RequestBody Cita cita){
	cita.setId(id);
	return citaServicio.guardar(cita);
}

@DeleteMapping("/{id}")
public void eliminar(@PathVariable Long id){
	citaServicio.eliminar(id);
}

}