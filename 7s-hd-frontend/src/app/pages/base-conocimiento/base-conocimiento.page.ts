import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-base-conocimiento',
  templateUrl: './base-conocimiento.page.html',
  styleUrls: ['./base-conocimiento.page.scss'],
  standalone: false
})
export class BaseConocimientoPage implements OnInit {

  baseDeConocimiento: any[] = [];
  buscar: string = '';
  categoriaSeleccionada: string = '';
  categoriaOpciones: any[] = [];
  displayChatDialog: boolean = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getFormatoBaseConocimientos();
  }

  async getFormatoBaseConocimientos(): Promise<void> {
    try {
      const data = await this.apiService.get<any[]>('controllers/categoriasbaseconocimientos.controller.php?op=todos');
      data.subscribe(response => {

        // Definir el tipo de categoriasMap explícitamente
        const categoriasMap: Record<string, { nombre: string; nombre1: string; guias: any[] }> = {};

        response.forEach(item => {
          if (!item.idCategoria) return; // Asegurar que idCategoria no sea undefined

          // Si la categoría ya existe, agregar guías
          if (categoriasMap[item.idCategoria]) {
            if (item.BaseConocimientosTitulo && item.BaseConocimientosContenido) {
              categoriasMap[item.idCategoria].guias.push({
                titulo: item.BaseConocimientosTitulo,
                contenido: item.BaseConocimientosContenido,
                expandir: false
              });
            }
          } else {
            // Si no existe, crear la categoría
            categoriasMap[item.idCategoria] = {
              nombre: item.nombreCategoria || 'Sin nombre',
              nombre1: item.descripcion || '',
              guias: []
            };

            // Agregar la primera guía si tiene contenido
            if (item.BaseConocimientosTitulo && item.BaseConocimientosContenido) {
              categoriasMap[item.idCategoria].guias.push({
                titulo: item.BaseConocimientosTitulo,
                contenido: item.BaseConocimientosContenido,
                expandir: false
              });
            }
          }
        });

        // Convertir el objeto en un array
        this.baseDeConocimiento = Object.values(categoriasMap);

        // Preparar opciones de filtro para el select
        this.categoriaOpciones = this.baseDeConocimiento.map(categoria => ({
          label: categoria.nombre,
          value: categoria.nombre
        }));

      });
    } catch (error) {
      console.error('Error al cargar la base de conocimiento', error);
    }
  }

  openChatDialog() {
    this.displayChatDialog = true;
  }

  alternarGuia(guia: any): void {
    guia.expandir = !guia.expandir;
  }

  filtrarCategorias() {
    if (!this.categoriaSeleccionada) {
      return this.baseDeConocimiento;
    }
    return this.baseDeConocimiento.filter(categoria => categoria.nombre === this.categoriaSeleccionada);
  }

  filtrarGuias(guias: any[]) {
    if (!this.buscar) {
      return guias;
    }
    const busquedaLower = this.buscar.toLowerCase();
    return guias.filter(guia =>
      guia.titulo.toLowerCase().includes(busquedaLower) ||
      guia.contenido.toLowerCase().includes(busquedaLower)
    );
  }

  filtrarResultados() {
    this.filtrarCategorias();
  }
}
