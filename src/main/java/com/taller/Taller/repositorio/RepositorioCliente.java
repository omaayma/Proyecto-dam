package com.taller.Taller.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taller.Taller.modelo.Cliente;

public interface RepositorioCliente extends JpaRepository<Cliente, Long>{

}
