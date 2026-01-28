import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecetaService } from '../../services/recetas.service';
import { IngredienteService } from '../../services/ingredientes.service';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css']
})
export class RecetasComponent implements OnInit {
  private recetaService = inject(RecetaService);
  private ingredienteService = inject(IngredienteService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 

  // --- VARIABLES DE CONTROL ---
  esEdicion = false;
  idRecetaEditar: number | null = null;
  
  // Base de datos de ingredientes cargada
  listaIngredientes: any[] = [];

  // --- VARIABLES DEL BUSCADOR VISUAL (HTML) ---
  nombreIngredienteBusqueda: string = '';
  cantidadAgregar: number = 0;
  
  // Variables para la Vista Previa (Preview)
  ingredienteSeleccionadoId: number | null = null;
  unidadSeleccionada: string = '';
  costoRealUnitario: number = 0;
  
  // --- MODELO DE LA RECETA ---
  nuevaReceta: any = { 
    nombre_receta: '',
    tipo_plato: 'Plato Principal',
    num_porciones: 1,
    tamano_porcion: 0,
    procedimiento: '',
    costo_receta: 0,
    rentabilidad: 30,
    precio_venta: 0,
    recetasIngredientes: [] 
  };

  ngOnInit() {
    this.cargarIngredientes();
    
    // DETECTAR SI VENIMOS A EDITAR (URL tiene un ID)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idRecetaEditar = Number(id);
        this.cargarDatosReceta(this.idRecetaEditar);
      }
    });
  }

  cargarIngredientes() {
    this.ingredienteService.findAll().subscribe(data => {
      this.listaIngredientes = data;
    });
  }

  // --- LÓGICA DE EDICIÓN ---
  cargarDatosReceta(id: number) {
    this.recetaService.findOne(id).subscribe({
      next: (data) => {
        // Mapeamos lo que llega del backend
        this.nuevaReceta = {
          nombre_receta: data.nombreReceta,
          tipo_plato: data.tipoPlato,
          num_porciones: data.numPorciones,
          
          // 👇 CONVERSIÓN DE CARGA: Kilos (BD) -> Gramos (Visual)
          // Si en la BD dice 0.5 kg, aquí mostramos 500
          tamano_porcion: (Number(data.tamanoPorcion) || 0) * 1000,
          
          procedimiento: data.procedimiento,
          costo_receta: data.costoReceta,
          rentabilidad: data.rentabilidad || 30,
          precio_venta: data.precioVenta || 0,
          
          // Mapeamos los ingredientes para la tabla visual
          recetasIngredientes: data.recetasIngredientes.map((ri: any) => ({
            id_ingrediente: ri.ingrediente.id,
            nombre: ri.ingrediente.nombre_ingrediente,
            unidad: ri.ingrediente.unidad_medida,
            cantidad_usada: ri.cantidad_usada,
            // Precio: Usamos el histórico guardado o el actual si no existe
            precio: Number(ri.costo_historico) || Number(ri.ingrediente.precio_real),
            subtotal: ri.cantidad_usada * (Number(ri.costo_historico) || Number(ri.ingrediente.precio_real))
          }))
        };
        this.calcularTotal();
      },
      error: (e) => alert('Error al cargar receta: ' + e.message)
    });
  }

  // --- MÉTODOS DEL BUSCADOR VISUAL ---

  alSeleccionarIngrediente(event: any) {
    const nombre = event.target.value;
    const encontrado = this.listaIngredientes.find(i => i.nombre_ingrediente === nombre);

    if (encontrado) {
      this.ingredienteSeleccionadoId = encontrado.id;
      this.unidadSeleccionada = encontrado.unidad_medida;
      this.costoRealUnitario = Number(encontrado.precio_real) || Number(encontrado.precioKg) || 0;
    } else {
      this.ingredienteSeleccionadoId = null;
      this.unidadSeleccionada = '';
      this.costoRealUnitario = 0;
    }
  }

  agregarIngrediente() {
    if (!this.ingredienteSeleccionadoId || this.cantidadAgregar <= 0) {
      alert('Selecciona un ingrediente válido y una cantidad mayor a 0');
      return;
    }

    const itemDB = this.listaIngredientes.find(i => i.id === this.ingredienteSeleccionadoId);
    if (!itemDB) return;

    this.nuevaReceta.recetasIngredientes.push({
      id_ingrediente: itemDB.id,
      nombre: itemDB.nombre_ingrediente,
      unidad: itemDB.unidad_medida,
      cantidad_usada: this.cantidadAgregar,
      precio: this.costoRealUnitario,
      subtotal: this.cantidadAgregar * this.costoRealUnitario
    });

    this.nombreIngredienteBusqueda = '';
    this.cantidadAgregar = 0;
    this.ingredienteSeleccionadoId = null;
    this.unidadSeleccionada = '';
    this.costoRealUnitario = 0;

    this.calcularTotal();
  }

  eliminarIngrediente(index: number) {
    this.nuevaReceta.recetasIngredientes.splice(index, 1);
    this.calcularTotal();
  }

  irACrearIngrediente() {
    if(confirm('Si sales ahora perderás los cambios no guardados. ¿Continuar?')) {
      this.router.navigate(['/ingredientes']);
    }
  }

  // --- CÁLCULOS MATEMÁTICOS ---

  calcularTotal() {
    let costoTotal = 0;
    this.nuevaReceta.recetasIngredientes.forEach((item: any) => {
      item.subtotal = item.cantidad_usada * item.precio;
      costoTotal += item.subtotal;
    });

    this.nuevaReceta.costo_receta = costoTotal;
    
    const costoPorcion = this.nuevaReceta.costo_receta / (this.nuevaReceta.num_porciones || 1);
    const rentabilidad = Number(this.nuevaReceta.rentabilidad) || 30;

    if (rentabilidad > 0 && rentabilidad < 100) {
      this.nuevaReceta.precio_venta = costoPorcion / (rentabilidad / 100);
    } else {
      this.nuevaReceta.precio_venta = 0;
    }
  }

  // --- GUARDAR EN BASE DE DATOS ---

  guardarReceta() {
    // 1. Validaciones
    if (!this.nuevaReceta.nombre_receta) return alert('El nombre del plato es obligatorio');
    if (this.nuevaReceta.recetasIngredientes.length === 0) return alert('La receta debe tener al menos 1 ingrediente');

    // 2. CONVERSIÓN DE GUARDADO: Gramos (Visual) -> Kilos (BD)
    // El usuario escribió "200" (gramos). Nosotros guardamos "0.2" (kilos).
    const pesoEnKilos = Number(this.nuevaReceta.tamano_porcion) / 1000;

    // 3. PREPARAR EL DTO (Backend Friendly)
    const dtoBackend = {
      nombre_receta: this.nuevaReceta.nombre_receta, 
      tipo_plato: this.nuevaReceta.tipo_plato,
      num_porciones: Number(this.nuevaReceta.num_porciones),
      
      // ✅ Enviamos el peso en Kilos, convertido a String
      tamano_porcion: String(pesoEnKilos), 
      
      procedimiento: this.nuevaReceta.procedimiento,
      costo_receta: Number(this.nuevaReceta.costo_receta),
      rentabilidad: Number(this.nuevaReceta.rentabilidad),
      precio_venta: Number(this.nuevaReceta.precio_venta),
      
      recetasIngredientes: this.nuevaReceta.recetasIngredientes.map((item: any) => ({
        // ✅ Estructura correcta para relaciones TypeORM
        ingrediente: { id: item.id_ingrediente }, 
        
        cantidad_usada: Number(item.cantidad_usada),
        costo_historico: Number(item.precio)
      }))
    };

    console.log('Enviando DTO (Gramos convertidos a Kilos):', dtoBackend); 

  
    if (this.esEdicion && this.idRecetaEditar) {
      this.recetaService.update(this.idRecetaEditar, dtoBackend).subscribe({
        next: () => {
          alert('✅ Ficha actualizada correctamente');
          this.router.navigate(['/ver-ficha', this.idRecetaEditar]);
        },
        error: (e) => {
          console.error(e);
          const errorMsg = e.error?.message || e.message;
          alert('Error al actualizar: ' + (Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg));
        }
      });
    } else {
      this.recetaService.create(dtoBackend).subscribe({
        next: (resp) => {
          alert('✅ Ficha creada con éxito');
          this.router.navigate(['/ver-ficha', resp.id]);
        },
        error: (e) => {
          console.error(e);
          const errorMsg = e.error?.message || e.message;
          alert('Error al crear: ' + (Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg));
        }
      });
    }
  }
}