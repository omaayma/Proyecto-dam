package com.taller.Taller.configuracion;

import com.taller.Taller.modelo.Empleado;
import com.taller.Taller.repositorio.RepositorioEmpleado;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class CargadorDatos {

    @Bean
    CommandLineRunner init(RepositorioEmpleado empleadoRepo, PasswordEncoder passwordEncoder) {
        return args -> {
            if (empleadoRepo.findByEmail("admin@wo.com").isEmpty()) {

                Empleado admin = new Empleado();
                admin.setNombre("Administrador Sistema");
                admin.setEmail("admin@wo.com");
                admin.setContrasena(passwordEncoder.encode("admin123"));

                admin.setDni("00000000A");

                empleadoRepo.save(admin);

                System.out.println("SISTEMA: Admin fijo creado con DNI 00000000A");
            }
        };
    }
}