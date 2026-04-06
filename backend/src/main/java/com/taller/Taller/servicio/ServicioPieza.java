package com.taller.Taller.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taller.Taller.modelo.Pieza;
import com.taller.Taller.repositorio.RepositorioPieza;

@Service
public class ServicioPieza {

@Autowired
private RepositorioPieza piezaRepositorio;

public List<Pieza> listar(){
	return piezaRepositorio.findAll();
}

public Pieza guardar(Pieza pieza){
	return piezaRepositorio.save(pieza);
}

public Pieza obtener(Long id){
	return piezaRepositorio.findById(id).orElse(null);
}

public void eliminar(Long id){
	piezaRepositorio.deleteById(id);
}

}
