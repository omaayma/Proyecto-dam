package com.taller.Taller.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.taller.Taller.modelo.Administrador;
import com.taller.Taller.servicio.ServicioAdministrador;

@RestController
@RequestMapping("api/administradores")
@CrossOrigin(origins = "*")
public class AdministradorControlador {

    @Autowired
    private ServicioAdministrador servicio;
    
    /*para los puntos de acceso*/
    @GetMapping("/panel")
    public String admin(){
        return "Panel administrador";
    }

    @GetMapping
    public List<Administrador> listar(){
        return servicio.listar();
    }

    @PostMapping
    public Administrador guardar(@RequestBody Administrador admin){
        return servicio.guardar(admin);
    }

    @GetMapping("/{id}")
    public Administrador obtener(@PathVariable Long id){
        return servicio.obtener(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id){
        servicio.eliminar(id);
    }
}