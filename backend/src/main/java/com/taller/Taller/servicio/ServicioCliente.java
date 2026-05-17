package com.taller.Taller.servicio;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.taller.Taller.modelo.Cliente;
import com.taller.Taller.repositorio.RepositorioCliente;

@Service
public class ServicioCliente {

    @Autowired
    private RepositorioCliente repositorio;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Cliente> listarClientes() {
        return repositorio.findAll();
    }

    public Cliente guardarCliente(Cliente cliente) {
        if (cliente.getContrasena() == null || cliente.getContrasena().isBlank()) {
            throw new IllegalArgumentException("La contraseña no puede estar vacía");
        }
        // Solo encodea si no está ya encriptada (evita doble encodeo en actualizaciones)
        if (!cliente.getContrasena().startsWith("$2a$")) {
            cliente.setContrasena(passwordEncoder.encode(cliente.getContrasena()));
        }
        return repositorio.save(cliente);
    }

    public Cliente actualizarCliente(Long id, Cliente clienteNuevo) {
        Cliente clienteExistente = repositorio.findById(id).orElse(null);
        if (clienteExistente == null) return null;

        clienteExistente.setNombre(clienteNuevo.getNombre());
        clienteExistente.setApellidos(clienteNuevo.getApellidos());
        clienteExistente.setDni(clienteNuevo.getDni());
        clienteExistente.setEmail(clienteNuevo.getEmail());
        clienteExistente.setTelefono(clienteNuevo.getTelefono());
        clienteExistente.setDireccion(clienteNuevo.getDireccion());

        // Solo se actualiza la contraseña si viene una nueva, si no conserva la anterior
        if (clienteNuevo.getContrasena() != null
                && !clienteNuevo.getContrasena().isBlank()
                && !clienteNuevo.getContrasena().startsWith("$2a$")) {
            clienteExistente.setContrasena(passwordEncoder.encode(clienteNuevo.getContrasena()));
        }

        return repositorio.save(clienteExistente);
    }

    public Cliente obtenerCliente(Long id) {
        return repositorio.findById(id).orElse(null);
    }

    public void eliminarCliente(Long id) {
        repositorio.deleteById(id);
    }
}