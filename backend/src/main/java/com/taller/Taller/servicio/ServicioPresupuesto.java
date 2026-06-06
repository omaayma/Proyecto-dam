package com.taller.Taller.servicio;

import java.util.List;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.taller.Taller.modelo.Presupuesto;
import com.taller.Taller.modelo.Vehiculo;
import com.taller.Taller.repositorio.RepositorioPresupuesto;
import com.taller.Taller.repositorio.RepositorioVehiculo;

@Service
public class ServicioPresupuesto {

    @Autowired
    private RepositorioPresupuesto presupuestoRepositorio;

    @Autowired
    private RepositorioVehiculo vehiculoRepositorio;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Presupuesto> listar(){
        return presupuestoRepositorio.findAll();
    }

    public Presupuesto guardar(Presupuesto presupuesto){
        if (presupuesto.getVehiculo() != null && presupuesto.getVehiculo().getId() != null) {
            Vehiculo vehiculoCompleto = vehiculoRepositorio.findById(presupuesto.getVehiculo().getId())
                    .orElseThrow(() -> new RuntimeException("Vehículo no encontrado al generar presupuesto"));
            presupuesto.setVehiculo(vehiculoCompleto);
        }

        boolean debeEnviarCorreo = false;

        if (presupuesto.getId() != null) {
            String estadoPrevio = presupuestoRepositorio.findById(presupuesto.getId())
                    .map(Presupuesto::getEstado)
                    .orElse("PENDIENTE");

            if (!"ACEPTADO".equals(estadoPrevio) && "ACEPTADO".equals(presupuesto.getEstado())) {
                debeEnviarCorreo = true;
            }
        } else {
            presupuesto.setEstado("PENDIENTE");
            presupuesto.setTotal(0.0);
        }

        Presupuesto presupuestoGuardado = presupuestoRepositorio.save(presupuesto);

        if (debeEnviarCorreo) {
            try {
                if (presupuestoGuardado.getVehiculo() != null && presupuestoGuardado.getVehiculo().getCliente() != null) {
                    Map<String, Object> datosN8n = new HashMap<>();

                    datosN8n.put("nombre", presupuestoGuardado.getVehiculo().getCliente().getNombre());
                    datosN8n.put("email", presupuestoGuardado.getVehiculo().getCliente().getEmail());
                    datosN8n.put("total", presupuestoGuardado.getTotal());

                    String infoVehiculo = "";
                    if (presupuestoGuardado.getVehiculo().getMarca() != null) {
                        infoVehiculo += presupuestoGuardado.getVehiculo().getMarca();
                    }
                    if (presupuestoGuardado.getVehiculo().getModelo() != null) {
                        infoVehiculo += " " + presupuestoGuardado.getVehiculo().getModelo();
                    }
                    datosN8n.put("vehiculo", infoVehiculo.trim().isEmpty() ? "Vehículo" : infoVehiculo.trim());

                    String urlN8n = "http://localhost:5678/webhook/presupuesto-generado";
                    restTemplate.postForObject(urlN8n, datosN8n, String.class);
                }
            } catch (Exception e) {
                System.err.println("Error enviando a n8n Presupuestos: " + e.getMessage());
            }
        }

        return presupuestoGuardado;
    }

    public Presupuesto obtener(Long id){
        return presupuestoRepositorio.findById(id).orElse(null);
    }

    public void eliminar(Long id){
        presupuestoRepositorio.deleteById(id);
    }
}