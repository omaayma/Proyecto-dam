package com.taller.Taller.servicio;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
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

    private final RestTemplate restTemplate = new RestTemplate();

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

        boolean debeEnviarCorreo = false;

        if (cita.getId() != null) {
            Cita citaOriginal = citaRepositorio.findById(cita.getId()).orElse(null);

            if (citaOriginal != null
                    && !"CONFIRMADA".equals(citaOriginal.getEstado())
                    && "CONFIRMADA".equals(cita.getEstado())) {
                debeEnviarCorreo = true;
            }
        }

        Cita citaGuardada = citaRepositorio.save(cita);

        if (debeEnviarCorreo) {
            try {
                if (citaGuardada.getVehiculo() != null && citaGuardada.getVehiculo().getCliente() != null) {
                    Map<String, Object> datosN8n = new HashMap<>();
                    datosN8n.put("nombre", citaGuardada.getVehiculo().getCliente().getNombre());
                    datosN8n.put("email", citaGuardada.getVehiculo().getCliente().getEmail());
                    datosN8n.put("fecha", citaGuardada.getFecha() != null ? citaGuardada.getFecha().toString() : "");
                    datosN8n.put("hora", citaGuardada.getHora() != null ? citaGuardada.getHora().toString() : "");

                    String urlN8n = "http://localhost:5678/webhook/cita-confirmada";
                    restTemplate.postForObject(urlN8n, datosN8n, String.class);
                }
            } catch (Exception e) {
                System.err.println("Error n8n al confirmar Cita en guardar: " + e.getMessage());
            }
        }

        return citaGuardada;
    }

    public Cita obtener(Long id) {
        return citaRepositorio.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        citaRepositorio.deleteById(id);
    }
}