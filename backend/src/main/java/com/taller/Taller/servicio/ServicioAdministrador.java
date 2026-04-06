package com.taller.Taller.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taller.Taller.modelo.Administrador;
import com.taller.Taller.repositorio.RepositorioAdministrador;

@Service
public class ServicioAdministrador {

    @Autowired
    private RepositorioAdministrador administradorRepositorio;

    public List<Administrador> listar(){
        return administradorRepositorio.findAll();
    }

    public Administrador guardar(Administrador admin){
        return administradorRepositorio.save(admin);
    }

    public Administrador obtener(Long id){
        return administradorRepositorio.findById(id).orElse(null);
    }

    public void eliminar(Long id){
        administradorRepositorio.deleteById(id);
    }
}