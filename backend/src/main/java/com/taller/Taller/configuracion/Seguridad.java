package com.taller.Taller.configuracion;

import com.taller.Taller.servicio.ServicioDetallesUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class Seguridad {

    @Autowired
    private ServicioDetallesUsuario servicioDetallesUsuario;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth

                        // ✅ CLIENTES sin seguridad
                        .requestMatchers("/api/clientes/**").permitAll()

                        // ✅ ADMIN
                        .requestMatchers("/api/administradores/**").hasRole("ADMIN")

                        // ✅ EMPLEADOS
                        .requestMatchers("/api/empleados/**").permitAll()

                        // ✅ SOLO ADMIN y EMPLEADO acceden a datos internos
                        .requestMatchers("/api/vehiculos/**", "/api/citas/**")
                        .hasAnyRole("ADMIN", "EMPLEADO")

                        // ✅ TODO lo demás permitido (evita errores)
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}