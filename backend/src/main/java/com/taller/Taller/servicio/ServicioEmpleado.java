package com.taller.Taller.servicio;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.taller.Taller.modelo.Empleado;
import com.taller.Taller.repositorio.RepositorioEmpleado;

@Service
public class ServicioEmpleado {

    @Autowired
    private RepositorioEmpleado repositorio;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Empleado> listar() {
        return repositorio.findAll();
    }

    public Empleado guardar(Empleado empleado) {
        // Encriptar la contraseña antes de guardar
        empleado.setContrasena(passwordEncoder.encode(empleado.getContrasena()));
        return repositorio.save(empleado);
    }

    public Empleado obtener(Long id) {
        return repositorio.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        repositorio.deleteById(id);
    }
}