package com.taller.Taller.servicio;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.taller.Taller.modelo.Cliente;
import com.taller.Taller.repositorio.RepositorioCliente;

@Service
public class ServicioCliente {

    @Autowired
    private RepositorioCliente repositorio;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Cliente> listarClientes() {
        return repositorio.findAll();
    }

    public Cliente guardarCliente(Cliente cliente) {
        if (cliente.getContrasena() == null || cliente.getContrasena().isBlank()) {
            throw new IllegalArgumentException("La contraseña no puede estar vacía");
        }

        if (!cliente.getContrasena().startsWith("$2a$")) {
            cliente.setContrasena(passwordEncoder.encode(cliente.getContrasena()));
        }

        Cliente clienteGuardado = repositorio.save(cliente);

        try {
            Map<String, Object> datosN8n = new HashMap<>();
            datosN8n.put("nombre", clienteGuardado.getNombre());
            datosN8n.put("email", clienteGuardado.getEmail());

            String urlN8n = "http://localhost:5678/webhook/bienvenida-cliente";
            restTemplate.postForObject(urlN8n, datosN8n, String.class);
        } catch (Exception e) {
            System.err.println("Error n8n Bienvenida: " + e.getMessage());
        }

        return clienteGuardado;
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