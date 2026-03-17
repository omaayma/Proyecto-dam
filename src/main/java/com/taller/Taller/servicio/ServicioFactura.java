package com.taller.Taller.servicio;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taller.Taller.modelo.Factura;
import com.taller.Taller.modelo.Pieza;
import com.taller.Taller.modelo.Presupuesto;
import com.taller.Taller.repositorio.RepositorioFactura;
import com.taller.Taller.repositorio.RepositorioPieza;
import com.taller.Taller.repositorio.RepositorioPresupuesto;

@Service
public class ServicioFactura {

@Autowired
private RepositorioFactura facturaRepositorio;
@Autowired
private RepositorioPresupuesto presupuestoRepositorio;

@Autowired
private RepositorioPieza piezaRepositorio;
public List<Factura> listar(){
	return facturaRepositorio.findAll();
}

public Factura guardar(Factura factura){

	if (factura.getPresupuesto() != null && factura.getPresupuesto().getId() != null) {
		Presupuesto pres = presupuestoRepositorio.findById(factura.getPresupuesto().getId())
                    .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado"));
            factura.setPresupuesto(pres);
        }

    if (factura.getPiezas() != null) {
        List<Pieza> piezasDb = factura.getPiezas().stream()
                .map(p -> piezaRepositorio.findById(p.getId()).orElse(null))
                .filter(p -> p != null).collect(Collectors.toList());
            factura.setPiezas(piezasDb);
        }

        return facturaRepositorio.save(factura);
    }

public Factura obtener(Long id){
	return facturaRepositorio.findById(id).orElse(null);
}

public void eliminar(Long id){
	facturaRepositorio.deleteById(id);
}

}
