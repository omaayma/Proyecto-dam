package com.taller.Taller.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taller.Taller.modelo.Factura;
import com.taller.Taller.repositorio.RepositorioFactura;

@Service
public class ServicioFactura {

@Autowired
private RepositorioFactura facturaRepositorio;

public List<Factura> listar(){
	return facturaRepositorio.findAll();
}

public Factura guardar(Factura factura){
	return facturaRepositorio.save(factura);
}

public Factura obtener(Long id){
	return facturaRepositorio.findById(id).orElse(null);
}

public void eliminar(Long id){
	facturaRepositorio.deleteById(id);
}

}
