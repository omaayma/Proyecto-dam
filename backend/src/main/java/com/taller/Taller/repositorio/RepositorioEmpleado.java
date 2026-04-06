package com.taller.Taller.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taller.Taller.modelo.Empleado;

public interface RepositorioEmpleado extends JpaRepository<Empleado, Long>{

}
