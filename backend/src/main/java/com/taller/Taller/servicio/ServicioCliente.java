package com.taller.Taller.servicio;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taller.Taller.modelo.Cliente;
import com.taller.Taller.repositorio.RepositorioCliente;

@Service
public class ServicioCliente {

@Autowired
private RepositorioCliente clienteRepositorio;

public List<Cliente> listarClientes(){
	return clienteRepositorio.findAll();
}

public Cliente guardarCliente(Cliente cliente){
	return clienteRepositorio.save(cliente);
}

public Cliente obtenerCliente(Long id){
	return clienteRepositorio.findById(id).orElse(null);
}

public void eliminarCliente(Long id){
	clienteRepositorio.deleteById(id);
}

}
