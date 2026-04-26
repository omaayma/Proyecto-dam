package com.taller.Taller.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.taller.Taller.modelo.Pieza;
import com.taller.Taller.servicio.ServicioPieza;

@RestController
@RequestMapping("api/piezas")
@CrossOrigin(origins = "*")
public class PiezaControlador {

@Autowired
private ServicioPieza piezaServicio;

@GetMapping
public List<Pieza> listar(){
	return piezaServicio.listar();
}

@PostMapping
public Pieza guardar(@RequestBody Pieza pieza){
	return piezaServicio.guardar(pieza);
}

@GetMapping("/{id}")
public Pieza obtener(@PathVariable Long id){
	return piezaServicio.obtener(id);
}

@PutMapping("/{id}")
public Pieza actualizar(@PathVariable Long id, @RequestBody Pieza pieza){
    pieza.setId(id);
    return piezaServicio.guardar(pieza); // Asegúrate que tu servicio se llame 'servicio'
    }
@DeleteMapping("/{id}")
public void eliminar(@PathVariable Long id){
	piezaServicio.eliminar(id);
}

}