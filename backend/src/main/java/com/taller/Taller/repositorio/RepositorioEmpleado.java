package com.taller.Taller.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taller.Taller.modelo.Empleado;
import java.util.Optional;

public interface RepositorioEmpleado extends JpaRepository<Empleado, Long> {
    Optional<Empleado> findByEmail(String email);
}