package com.taller.Taller.servicio;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taller.Taller.modelo.Cita;
import com.taller.Taller.modelo.Empleado;
import com.taller.Taller.modelo.Vehiculo;
import com.taller.Taller.repositorio.RepositorioCita;
import com.taller.Taller.repositorio.RepositorioEmpleado;
import com.taller.Taller.repositorio.RepositorioVehiculo;

@Service
public class ServicioCita {

    @Autowired
    private RepositorioCita citaRepositorio;

    @Autowired
    private RepositorioEmpleado empleadoRepositorio;

    @Autowired
    private RepositorioVehiculo vehiculoRepositorio;

    public List<Cita> listar() {
        return citaRepositorio.findAll();
    }

    public Cita guardar(Cita cita) {


        if (cita.getEmpleado() != null && cita.getEmpleado().getId() != null) {
            Empleado empleado = empleadoRepositorio.findById(cita.getEmpleado().getId())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            cita.setEmpleado(empleado);
        }

        if (cita.getVehiculo() != null && cita.getVehiculo().getId() != null) {
            Vehiculo vehiculo = vehiculoRepositorio.findById(cita.getVehiculo().getId())
                    .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));
            cita.setVehiculo(vehiculo);
        }

        return citaRepositorio.save(cita);
    }

    public Cita obtener(Long id) {
        return citaRepositorio.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        citaRepositorio.deleteById(id);
    }
}