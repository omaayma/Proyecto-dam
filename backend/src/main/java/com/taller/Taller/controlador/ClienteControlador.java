package com.taller.Taller.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.taller.Taller.modelo.Cliente;
import com.taller.Taller.servicio.ServicioCliente;

@RestController
@RequestMapping("api/clientes")
@CrossOrigin(origins = "*")
public class ClienteControlador {

@Autowired
private ServicioCliente clienteServicio;
@GetMapping("/panel")
public String cliente(){
    return "Panel cliente";
}

@GetMapping
public List<Cliente> listar(){
	return clienteServicio.listarClientes();
}

@GetMapping("/{id}")
public Cliente obtener(@PathVariable Long id){
	return clienteServicio.obtenerCliente(id);
}

@PostMapping
public Cliente guardar(@RequestBody Cliente cliente){
	return clienteServicio.guardarCliente(cliente);
}

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
        Cliente actualizado = clienteServicio.actualizarCliente(id, cliente);
        if (actualizado == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(actualizado);
    }

@DeleteMapping("/{id}")
public void eliminar(@PathVariable Long id){
	clienteServicio.eliminarCliente(id);
}

}