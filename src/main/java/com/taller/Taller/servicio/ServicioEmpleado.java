package com.taller.Taller.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taller.Taller.modelo.Empleado;
import com.taller.Taller.repositorio.RepositorioEmpleado;

@Service
public class ServicioEmpleado {

@Autowired
private RepositorioEmpleado empleadoRepositorio;

public List<Empleado> listar(){
	return empleadoRepositorio.findAll();
}

public Empleado guardar(Empleado empleado){
	return empleadoRepositorio.save(empleado);
}

public Empleado obtener(Long id){
	return empleadoRepositorio.findById(id).orElse(null);
}

public void eliminar(Long id){
	empleadoRepositorio.deleteById(id);
}

}
