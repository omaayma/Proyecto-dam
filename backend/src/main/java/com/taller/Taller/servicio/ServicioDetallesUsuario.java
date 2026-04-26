package com.taller.Taller.servicio;

import com.taller.Taller.modelo.Administrador;
import com.taller.Taller.modelo.Cliente;
import com.taller.Taller.modelo.Empleado;
import com.taller.Taller.repositorio.RepositorioAdministrador;
import com.taller.Taller.repositorio.RepositorioCliente;
import com.taller.Taller.repositorio.RepositorioEmpleado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class ServicioDetallesUsuario implements UserDetailsService {

    @Autowired private RepositorioAdministrador repoAdmin;
    @Autowired private RepositorioEmpleado repoEmpleado;
    @Autowired private RepositorioCliente repoCliente;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Intentar buscar en Administradores usando el nuevo método del repo
        Optional<Administrador> admin = repoAdmin.findByEmail(email);
        if (admin.isPresent()) {
            return new User(admin.get().getEmail(), admin.get().getContrasena(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }

        // Intentar buscar en Empleados
        Optional<Empleado> empleado = repoEmpleado.findByEmail(email);
        if (empleado.isPresent()) {
            return new User(empleado.get().getEmail(), empleado.get().getContrasena(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_EMPLEADO")));
        }

        //Intentar buscar en Clientes
        Optional<Cliente> cliente = repoCliente.findByEmail(email);
        if (cliente.isPresent()) {
            return new User(cliente.get().getEmail(), cliente.get().getContrasena(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_CLIENTE")));
        }

        throw new UsernameNotFoundException("Usuario no encontrado con email: " + email);
    }
}