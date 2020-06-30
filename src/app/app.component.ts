import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from "@angular/material";
import { DialogResultadoComponent } from './dialog-resultado/dialog-resultado.component'


export class ProductoData {
	arancel: number;
	cantidad: string;
	descripcion: string;
	id: string;
	impuesto_interno: number;
	iva: number;
	nomenclador: string;
	tasa_estadistica: number;
}
export class CalcParams {
	costoAduanaPorKilo:number;
	precioPrimerKilo:number;
	porcSeguroPM: number;
	porcSeguroAduana:number;
	precioKiloSiguientes:number;
	descPrimerEnvio:number;
}
export class CalcResultado {
	valorFOB: number =0;
	envioAduana:number = 0;
	seguroAduana:number = 0;
	baseImponibleAduana:number = 0;

	iva:number= 0;
	estadistica:number=0;
	aranceles:number=0;
	impuestosInternos:number=0;
	totalAduana:number=0;
	envioPM:number=0;
	dtoPrimerEnvio:number=0;
	seguro:number=0;
	totalGeneral:number=0;
	totalKilos:number=0;
	pesoDimensional:number=0;
	pesoAUsar:number=0;


}
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'calc-importer';
	
	_form: FormGroup;
	filteredOptions: Observable<any>
	_globalParams:CalcParams = null;
	_ProductoElegido:ProductoData;
	_resultado:CalcResultado = new CalcResultado();
	_resultadoListo:boolean = false;
	dlgRef:any=null;
	_usarPesoDimensional:boolean = false;

	constructor(
		private fb: FormBuilder,
		private http: HttpClient,
		public dialog: MatDialog
		
		) {
			this._form =  this.fb.group({
				Producto : [null, Validators.required],
				Precio : [null, Validators.required],
				Peso: [null, Validators.required],
				Unidad_Peso: ["kg", Validators.required]});
			
		}
		ngOnInit() {
			
			
			this._form.controls.Producto.valueChanges.pipe(debounceTime(400)).subscribe (valor => {this.buscar(valor); });
			this.loadParams();
			/*setTimeout(() => { //Le damos un tiempin para hacer foco, ya que la muy turra lo pierde luego con el autocomplete.
				this.input.focus();		
			}, 200);*/
			
		}
		loadParams () {
			let adr = "http://puntomio.folkatesting.com/wp-json/calculadora/v1/parametrizados/";//"http://localhost/paramscalc";
			this.http.get(adr).subscribe(params=> {
				if (params) {
					this._globalParams = new CalcParams();
					this._globalParams.costoAduanaPorKilo = params[0].importe*1;
					this._globalParams.precioPrimerKilo = params[1].importe*1;
					this._globalParams.porcSeguroPM = params[2].importe*1;
					this._globalParams.porcSeguroAduana = params[3].importe*1;
					this._globalParams.precioKiloSiguientes = params[4].importe*1;
					this._globalParams.descPrimerEnvio = params[5].importe*1;
				}
			});
		}

		buscar (name) {
			//let adr = "http://localhost/pito";
			
			if (typeof name === "string") { //Filtremos la seleccion
				let adr = "http://puntomio.folkatesting.com/wp-json/calculadora/v1/nomenclador/" + name.trim();	
				this.filteredOptions = this.http.get(adr);
			} else {
				this._ProductoElegido = name;	
			}
		}
		stopPropagation (event) {
			event.stopPropagation();
		}
		_doCalc () {
			this._resultado.valorFOB = this._form.controls["Precio"].value*1;
			//Veamos si ingreso kilos o libras
			if (this._form.controls["Unidad_Peso"].value=="kg") {
				this._resultado.totalKilos = this._form.controls["Peso"].value*1;
			} else {
				this._resultado.totalKilos = this._form.controls["Peso"].value*0.45359237;
			}
			//Peso Dimensional
			this._resultado.pesoAUsar = this._resultado.totalKilos;
			if (this._usarPesoDimensional) {
				this._resultado.pesoDimensional = this._form.controls["Largo"].value*this._form.controls["Ancho"].value*this._form.controls["Profundidad"].value;
				if (this._form.controls["Unidad_Medidas"].value=="cm") {
					this._resultado.pesoDimensional = this._resultado.pesoDimensional / 2270.8;
				} else {
					this._resultado.pesoDimensional = this._resultado.pesoDimensional / 139;
				}
				//Peso a usar para envio Punto Mío
				if ((this._resultado.pesoDimensional>this._resultado.totalKilos)) {
					this._resultado.pesoAUsar = this._resultado.pesoDimensional;
				} 
			}
			this._resultado.pesoAUsar = Math.ceil(this._resultado.pesoAUsar);

			//CostoAduana:
			this._resultado.envioAduana = this._resultado.totalKilos*this._globalParams.costoAduanaPorKilo;
			//Seguro Aduana
			this._resultado.seguroAduana = (this._resultado.valorFOB*this._globalParams.porcSeguroAduana/100);
			//Base Imponible Aduana
			this._resultado.baseImponibleAduana = this._resultado.valorFOB + this._resultado.envioAduana + this._resultado.seguroAduana;
			//Estadistica
			this._resultado.estadistica = (this._resultado.baseImponibleAduana * this._ProductoElegido.tasa_estadistica /100);
			//Arancel
			this._resultado.aranceles = (this._resultado.baseImponibleAduana * this._ProductoElegido.arancel /100);
			//Impuestos Internos
			this._resultado.impuestosInternos = (this._resultado.baseImponibleAduana * this._ProductoElegido.impuesto_interno /100);
			//Iva
			this._resultado.iva = (this._resultado.baseImponibleAduana +this._resultado.estadistica + this._resultado.aranceles)*this._ProductoElegido.iva/100;
			//Total Aduana
			this._resultado.totalAduana = this._resultado.iva+this._resultado.aranceles+this._resultado.impuestosInternos+this._resultado.estadistica;
			//Envio Punto Mío
			this._resultado.envioPM = this._globalParams.precioPrimerKilo + ((this._resultado.pesoAUsar-1)*this._globalParams.precioKiloSiguientes);
			//Descuento primer envio
			this._resultado.dtoPrimerEnvio = this._resultado.envioPM * this._globalParams.descPrimerEnvio/100;
			//Seguro PM
			this._resultado.seguro = this._resultado.valorFOB * this._globalParams.porcSeguroPM / 100;
			this._resultado.totalGeneral = this._resultado.totalAduana + this._resultado.envioPM  + this._resultado.seguro;
			this._resultadoListo = true;
			console.log(this._resultado);
			this.roundAll();

			this.dlgRef = this.dialog.open(DialogResultadoComponent, {data:this._resultado});
			
		}
		private roundAll () {
			for (var k in this._resultado) {
				if (this._resultado[k]*1!=0) {
					this._resultado[k] = Math.round(this._resultado[k]*100)/100;
				}
			}
		}
		displayFn (campo?: ProductoData): string | undefined {
			return campo ? campo.descripcion : undefined;
		}
		setPD (status) {
			
			if (!status) {
				this._form.removeControl("Largo");
				this._form.removeControl("Ancho");
				this._form.removeControl("Profundidad");
				this._form.removeControl("Unidad_Medidas");
			} else {
				this._form.addControl("Largo", new FormControl (null, Validators.required));
				this._form.addControl("Ancho", new FormControl (null, Validators.required));
				this._form.addControl("Profundidad", new FormControl (null, Validators.required));
				this._form.addControl("Unidad_Medidas", new FormControl ("cm", Validators.required));
			}
			this._usarPesoDimensional = status;
			console.log(this._form.invalid);
		}	
		

	}
	