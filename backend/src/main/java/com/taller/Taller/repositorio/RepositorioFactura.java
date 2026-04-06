package com.taller.Taller.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;
import com.taller.Taller.modelo.Factura;

public interface RepositorioFactura extends JpaRepository<Factura, Long>{

}
