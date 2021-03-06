import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Sesion } from '../../modelos/sesion';
import { SesionService } from '../../servicios/sesion.service';
import { Empresa } from '../../modelos/empresa';
import { Parametro } from '../../modelos/parametro';
import { EmpresaService } from '../../servicios/empresa.service';
import { ParametroService } from '../../servicios/parametro.service';
import { environment } from '../../../environments/environment';
import * as constantes from '../../constantes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  usuario: string;
  clave: string;
}

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {

  usuario: string="";
  clave: string="";

  sesion = new Sesion();

  empresa= new Empresa();
  empresas: Empresa[]=[];

  urlLogo: string ="";
  urlEmpresa: string="";
  urlIcoempresa: string = environment.prefijo_url_imagenes+"iconos/icoempresa.png";
  urlIcousuario: string = environment.prefijo_url_imagenes+"iconos/icousuario.png";
  urlIcocontrasenia: string = environment.prefijo_url_imagenes+"iconos/icocontrasenia.png";

  constructor(private sesionService: SesionService, private empresaService: EmpresaService, 
    private parametroService: ParametroService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.obtenerEmpresa();
    this.obtenerParametro();
    this.consultarEmpresas();
  }

  iniciarSesion() {
    this.sesionService.obtenerIP().subscribe(
      res => {
        this.sesion.sesionIp=res;
        this.sesionService.crear(this.sesion).subscribe(
          res => {
            this.sesion=res.resultado as Sesion;
            this.sesionService.setSesion(this.sesion);
            Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
            this.navegarExito();
          },
          err => {
            Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
            this.navegarError();
          }
        );
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  navegarExito() {
    this.router.navigateByUrl('/main');
  }
  navegarError() {
    this.router.navigateByUrl('/index');
  }

  activarSesion() {
    
  }

  consultarEmpresas() {
    this.empresaService.consultar().subscribe(
      res => {
        this.empresas = res.resultado as Empresa[]
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  obtenerEmpresa(){
    let empresaId=1;
    this.empresaService.obtener(empresaId).subscribe(
      res => {
        let empresa= res.resultado as Empresa
        this.urlEmpresa=environment.prefijo_url_imagenes+"logos/"+empresa.logo;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  obtenerParametro(){
    let parametro=new Parametro();
    parametro.tipo='LOGO';
    this.parametroService.obtenerTipo(parametro).subscribe(
      res => {
        parametro= res.resultado as Parametro;
        this.urlLogo=environment.prefijo_url_imagenes+parametro.nombre;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CambioCredencialesComponent, {
      width: '50%',
      data: {usuario: this.usuario, clave: this.clave}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El dialogo para cambio de contrase??a fue cerrado');
      this.usuario = result;
    });
  }
}

@Component({
  selector: 'cambio-credenciales',
  templateUrl: 'cambio-credenciales.component.html',
})
export class CambioCredencialesComponent {

  sesion = new Sesion();
  repetir_contrasena: string;

  constructor(
    public dialogRef: MatDialogRef<CambioCredencialesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}