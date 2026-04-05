package com.taller.Taller.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taller.Taller.modelo.Administrador;

public interface RepositorioAdministrador extends JpaRepository<Administrador, Long> {

}