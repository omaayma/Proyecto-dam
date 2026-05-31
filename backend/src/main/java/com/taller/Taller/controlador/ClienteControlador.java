package com.taller.Taller.controlador;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.taller.Taller.modelo.Cliente;
import com.taller.Taller.servicio.ServicioCliente;

@RestController
@RequestMapping("api/clientes")
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
        // 1. Buscamos el cliente actual con TODOS sus datos reales de la base de datos (incluido DNI, etc.)
        Cliente clienteExistente = clienteServicio.obtenerCliente(id);
        if (clienteExistente == null) {
            return ResponseEntity.notFound().build();
        }

        // 2. Mantenemos el DNI antiguo si el frontend no envió uno nuevo, para evitar el error de base de datos
        if (cliente.getDni() == null || cliente.getDni().trim().isEmpty()) {
            cliente.setDni(clienteExistente.getDni());
        }

        // 3. Mantenemos la Contraseña antigua si vino vacía desde el formulario
        if (cliente.getContrasena() == null || cliente.getContrasena().trim().isEmpty()) {
            cliente.setContrasena(clienteExistente.getContrasena());
        }

        // 4. Si tienes campo de 'email' o similar que tampoco esté en el formulario del perfil, descomenta esto:
        // if (cliente.getEmail() == null || cliente.getEmail().trim().isEmpty()) {
        //     cliente.setEmail(clienteExistente.getEmail());
        // }

        // 5. Ejecutamos la actualización normal con el objeto completamente restaurado
        Cliente actualizado = clienteServicio.actualizarCliente(id, cliente);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id){
        clienteServicio.eliminarCliente(id);
    }
}