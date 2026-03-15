package com.taller.Taller.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taller.Taller.modelo.Vehiculo;
import com.taller.Taller.repositorio.RepositorioVehiculo;

@Service
public class ServicioVehiculo {

@Autowired
private RepositorioVehiculo vehiculoRepositorio;

public List<Vehiculo> listar(){
	return vehiculoRepositorio.findAll();
}

public Vehiculo guardar(Vehiculo vehiculo){
	return vehiculoRepositorio.save(vehiculo);
}

public Vehiculo obtener(Long id){
	return vehiculoRepositorio.findById(id).orElse(null);
}

public void eliminar(Long id){
	vehiculoRepositorio.deleteById(id);
}

}
