import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import * as constantes from '../../constantes';
import * as util from '../../util';
import { SesionService } from 'src/app/servicios/sesion.service';
import { Sesion } from 'src/app/modelos/sesion';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TipoRetencion } from 'src/app/modelos/tipo-retencion';
import { TipoRetencionService } from 'src/app/servicios/tipo-retencion.service';

@Component({
  selector: 'app-tipo-retencion',
  templateUrl: './tipo-retencion.component.html',
  styleUrls: ['./tipo-retencion.component.scss']
})
export class TipoRetencionComponent implements OnInit {

  abrirPanelNuevoTipoRetencion = true;
  abrirPanelAdminTipoRetencion = false;

  sesion: Sesion=null;
  tipoRetencion= new TipoRetencion();
  tiposRetenciones: TipoRetencion[];

  columnasTipoRetencion: any[] = [
    { nombreColumna: 'id', cabecera: 'ID', celda: (row: TipoRetencion) => `${row.id}` },
    { nombreColumna: 'codigo', cabecera: 'Código', celda: (row: TipoRetencion) => `${row.codigo}` },
    { nombreColumna: 'impuestoRetencion', cabecera: 'Impuesto Retención', celda: (row: TipoRetencion) => `${row.impuestoRetencion}` },
    { nombreColumna: 'tipoRetencion', cabecera: 'Tipo de Retención', celda: (row: TipoRetencion) => `${row.tipoRetencion}` },
    { nombreColumna: 'codigoNorma', cabecera: 'Código Norma', celda: (row: TipoRetencion) => `${row.codigoNorma}` },
    { nombreColumna: 'homologacionFE', cabecera: 'Homologacion FE', celda: (row: TipoRetencion) => `${row.homologacionFE==null? "NA": row.homologacionFE}` },
    { nombreColumna: 'descripcion', cabecera: 'Descripcion', celda: (row: TipoRetencion) => `${row.descripcion}` },
    { nombreColumna: 'porcentaje', cabecera: 'Porcentaje', celda: (row: TipoRetencion) => `${row.porcentaje}` }
  ];
  cabeceraTipoRetencion: string[] = this.columnasTipoRetencion.map(titulo => titulo.nombreColumna);
  dataSourceTipoRetencion: MatTableDataSource<TipoRetencion>;
  clickedRows = new Set<TipoRetencion>();
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tipoRetencionService: TipoRetencionService,
    private sesionService: SesionService,private router: Router) { }

  ngOnInit() {
    this.sesion=util.validarSesion(this.sesionService, this.router);
    this.consultar();
  }
  
  @HostListener('window:keypress', ['$event'])
  keyEvent($event: KeyboardEvent) {
    if (($event.shiftKey || $event.metaKey) && $event.key == 'G') //SHIFT + G
      this.crear(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'N') //ASHIFT + N
      this.nuevo(null);
    if (($event.shiftKey || $event.metaKey) && $event.key == 'E') // SHIFT + E
      this.eliminar(null);
  }

  nuevo(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoRetencion = new TipoRetencion();
  }

  crear(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoRetencionService.crear(this.tipoRetencion).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.tipoRetencion=res.resultado as TipoRetencion;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  actualizar(event) {
    if (event!=null)
      event.preventDefault();
    this.tipoRetencionService.actualizar(this.tipoRetencion).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.tipoRetencion=res.resultado as TipoRetencion;
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  eliminar(event:any) {
    if (event!=null)
      event.preventDefault();
    this.tipoRetencionService.eliminar(this.tipoRetencion).subscribe(
      res => {
        Swal.fire({ icon: constantes.exito_swal, title: constantes.exito, text: res.mensaje });
        this.nuevo(null);
        this.consultar();
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }
  
  consultar() {
    this.tipoRetencionService.consultar().subscribe(
      res => {
        this.tiposRetenciones = res.resultado as TipoRetencion[]
        this.dataSourceTipoRetencion = new MatTableDataSource(this.tiposRetenciones);
        this.dataSourceTipoRetencion.paginator = this.paginator;
        this.dataSourceTipoRetencion.sort = this.sort;
      },
      err => Swal.fire({ icon: constantes.error_swal, title: constantes.error, text: err.error.codigo, footer: err.error.mensaje })
    );
  }

  seleccion(tipoRetencion: TipoRetencion) {
    if (!this.clickedRows.has(tipoRetencion)){
      this.clickedRows.clear();
      this.clickedRows.add(tipoRetencion);
      this.tipoRetencion = tipoRetencion;
    } else {
      this.clickedRows.clear();
      this.tipoRetencion = new TipoRetencion();
    }
  }

  filtroTipoRetencion(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTipoRetencion.filter = filterValue.trim().toUpperCase();
    if (this.dataSourceTipoRetencion.paginator) {
      this.dataSourceTipoRetencion.paginator.firstPage();
    }
  }

}
