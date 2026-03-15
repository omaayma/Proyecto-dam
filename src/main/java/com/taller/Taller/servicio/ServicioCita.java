package com.taller.Taller.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taller.Taller.modelo.Cita;
import com.taller.Taller.repositorio.RepositorioCita;

@Service
public class ServicioCita {

@Autowired
private RepositorioCita citaRepositorio;

public List<Cita> listar(){
	return citaRepositorio.findAll();
}

public Cita guardar(Cita cita){
	return citaRepositorio.save(cita);
}

public Cita obtener(Long id){
	return citaRepositorio.findById(id).orElse(null);
}

public void eliminar(Long id){
	citaRepositorio.deleteById(id);
}

}
