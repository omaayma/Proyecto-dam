package com.taller.Taller.configuracion;

import com.taller.Taller.servicio.ServicioDetallesUsuario;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        /*
         * allowCredentials(true) permite que el navegador mande
         * el header Authorization con las credenciales Basic Auth.
         */
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    /*
     * Suprimido la cabecera WWW-Authenticate para que el navegador
     * no muestre su popup nativo de login ante un 401.
     */
    @Bean
    public AuthenticationEntryPoint puntoDeEntrada() {
        return (request, response, authException) -> {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\": \"No autorizado\"}");
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                /*
                 * CSRF desactivado intencionalmente.
                 * API REST stateless con Basic Auth, sin cookies de sesión.
                 */
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/clientes").permitAll()

                        .requestMatchers("/api/administradores/**").hasRole("ADMIN")
                        .requestMatchers("/api/empleados/**").hasRole("ADMIN")

                        .requestMatchers("/api/clientes/**").hasAnyRole("ADMIN", "EMPLEADO", "CLIENTE")                        .requestMatchers("/api/piezas/**").hasAnyRole("ADMIN", "EMPLEADO")
                        .requestMatchers("/api/facturas/**").hasAnyRole("ADMIN", "EMPLEADO")
                        .requestMatchers("/api/presupuestos/**").hasAnyRole("ADMIN", "EMPLEADO")

                        .requestMatchers("/api/vehiculos/**").hasAnyRole("ADMIN", "EMPLEADO", "CLIENTE")
                        .requestMatchers("/api/citas/**").hasAnyRole("ADMIN", "EMPLEADO", "CLIENTE")

                        .anyRequest().authenticated()
                )

                .httpBasic(basic -> basic.authenticationEntryPoint(puntoDeEntrada()))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(puntoDeEntrada()));

        return http.build();
    }
}