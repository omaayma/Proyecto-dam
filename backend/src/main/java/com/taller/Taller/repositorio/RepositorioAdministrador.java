package com.taller.Taller.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taller.Taller.modelo.Administrador;
import java.util.Optional;

public interface RepositorioAdministrador extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByEmail(String email);
}