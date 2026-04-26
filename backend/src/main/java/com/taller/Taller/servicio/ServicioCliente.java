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
        // Encriptar la contraseña antes de guardar
        cliente.setContrasena(passwordEncoder.encode(cliente.getContrasena()));
        return repositorio.save(cliente);
    }

    public Cliente obtenerCliente(Long id) {
        return repositorio.findById(id).orElse(null);
    }

    public void eliminarCliente(Long id) {
        repositorio.deleteById(id);
    }
}