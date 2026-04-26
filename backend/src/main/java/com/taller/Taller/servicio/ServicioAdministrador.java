package com.taller.Taller.servicio;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.taller.Taller.modelo.Administrador;
import com.taller.Taller.repositorio.RepositorioAdministrador;

@Service
public class ServicioAdministrador {

    @Autowired
    private RepositorioAdministrador repositorio;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Administrador> listar() {
        return repositorio.findAll();
    }

    public Administrador guardar(Administrador admin) {
        // Encriptar la contraseña antes de guardar
        admin.setContrasena(passwordEncoder.encode(admin.getContrasena()));
        return repositorio.save(admin);
    }

    public Administrador obtener(Long id) {
        return repositorio.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        repositorio.deleteById(id);
    }
}