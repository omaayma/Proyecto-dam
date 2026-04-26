package com.taller.Taller.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.taller.Taller.modelo.Factura;
import com.taller.Taller.servicio.ServicioFactura;

@RestController
@RequestMapping("api/facturas")
@CrossOrigin(origins = "*")
public class FacturaControlador {

@Autowired
private ServicioFactura facturaServicio;

@GetMapping
public List<Factura> listar(){
	return facturaServicio.listar();
}

@PostMapping
public Factura guardar(@RequestBody Factura factura){
	return facturaServicio.guardar(factura);
}

@GetMapping("/{id}")
public Factura obtener(@PathVariable Long id){
	return facturaServicio.obtener(id);
}
@PutMapping("/{id}")
public Factura actualizar(@PathVariable Long id, @RequestBody Factura factura) {
    factura.setId(id);
    return facturaServicio.guardar(factura);
}

@DeleteMapping("/{id}")
public void eliminar(@PathVariable Long id) {
    facturaServicio.eliminar(id);
}

}