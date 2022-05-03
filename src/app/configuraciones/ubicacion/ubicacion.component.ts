import { Component, OnInit, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { UbicacionService } from '../../servicios/ubicacion.service';
import { Ubicacion } from '../../modelos/ubicacion';
import { TabService } from '../../componentes/services/tab.service';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { Sesion } from 'src/app/modelos/sesion';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})
export class UbicacionComponent implements OnInit {

  ubicacion= new Ubicacion();
  sesion: Sesion;

  constructor(private sesionService: SesionService, private router: Router, private tabService: TabService,private ubicacionService: UbicacionService) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.construirUbicacion();
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.ubicacion = new Ubicacion();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.ubicacionService.crear(this.ubicacion).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.ubicacionService.actualizar(this.ubicacion).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.ubicacion=res.resultado as Ubicacion;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(ubicacion: Ubicacion) {
    this.ubicacionService.eliminar(ubicacion).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.ubicacion=res.resultado as Ubicacion
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  async construirUbicacion() {
    let ubicacionId=0;
    this.ubicacionService.currentMessage.subscribe(message => ubicacionId = message);
    if (ubicacionId!= 0) {
      await this.ubicacionService.obtenerAsync(ubicacionId).then(
        res => {
          Object.assign(this.ubicacion, res.resultado as Ubicacion);
          this.ubicacionService.enviar(0);
        },
        err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
      );
    }
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 71) //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 78) //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.keyCode == 69) // SHIFT + E
      this.eliminar(null);
  }
}
