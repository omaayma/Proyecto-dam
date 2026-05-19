package com.taller.Taller.controlador;

import com.taller.Taller.modelo.Cliente;
import com.taller.Taller.modelo.Empleado;
import com.taller.Taller.repositorio.RepositorioCliente;
import com.taller.Taller.repositorio.RepositorioEmpleado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthControlador {

    @Autowired private RepositorioEmpleado repoEmpleado;
    @Autowired private RepositorioCliente  repoCliente;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();

        String email = principal.getName();
        Map<String, Object> resp = new HashMap<>();

        Optional<Empleado> empleado = repoEmpleado.findByEmail(email);
        if (empleado.isPresent()) {
            String rol = empleado.get().getRol() != null
                    ? empleado.get().getRol().toUpperCase()
                    : "EMPLEADO";
            resp.put("rol",      rol);
            resp.put("nombre",   empleado.get().getNombre());
            resp.put("email",    email);
            resp.put("clienteId", null);
            return ResponseEntity.ok(resp);
        }

        Optional<Cliente> cliente = repoCliente.findByEmail(email);
        if (cliente.isPresent()) {
            resp.put("rol",      "CLIENTE");
            resp.put("nombre",   cliente.get().getNombre());
            resp.put("email",    email);
            resp.put("clienteId", cliente.get().getId());
            return ResponseEntity.ok(resp);
        }

        return ResponseEntity.status(404).build();
    }
}