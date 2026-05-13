package com.taller.Taller.configuracion;

import com.taller.Taller.servicio.ServicioDetallesUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
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
                        // Permitir registro de clientes a todos
                        .requestMatchers("/api/clientes/**").permitAll()

                        // Restricciones por Rol
                        .requestMatchers("/api/administradores/**").hasRole("ADMIN")
                        .requestMatchers("/api/empleados/**").hasAnyRole("ADMIN", "EMPLEADO")
                        .requestMatchers("/api/vehiculos/**", "/api/citas/**").hasAnyRole("ADMIN", "EMPLEADO", "CLIENTE")

                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}