package com.taller.Taller.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taller.Taller.modelo.Cliente;
import java.util.Optional;

public interface RepositorioCliente extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmail(String email);
}