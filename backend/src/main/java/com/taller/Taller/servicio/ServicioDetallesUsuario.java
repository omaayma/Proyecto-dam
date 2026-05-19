package com.taller.Taller.servicio;

import com.taller.Taller.modelo.Cliente;
import com.taller.Taller.modelo.Empleado;
import com.taller.Taller.repositorio.RepositorioCliente;
import com.taller.Taller.repositorio.RepositorioEmpleado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServicioDetallesUsuario implements UserDetailsService {

    @Autowired private RepositorioEmpleado repoEmpleado;
    @Autowired private RepositorioCliente  repoCliente;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Optional<Empleado> empleado = repoEmpleado.findByEmail(email);
        if (empleado.isPresent()) {
            String rol = empleado.get().getRol() != null
                    ? empleado.get().getRol().toUpperCase()
                    : "EMPLEADO";
            return new User(
                    email,
                    empleado.get().getContrasena(),
                    List.of(new SimpleGrantedAuthority("ROLE_" + rol))
            );
        }

        Optional<Cliente> cliente = repoCliente.findByEmail(email);
        if (cliente.isPresent()) {
            return new User(
                    email,
                    cliente.get().getContrasena(),
                    List.of(new SimpleGrantedAuthority("ROLE_CLIENTE"))
            );
        }

        throw new UsernameNotFoundException("Usuario no encontrado: " + email);
    }
}