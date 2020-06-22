import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';



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
	seguroAduanda:number = 0;
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
	totalKilos:number;

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
	
	constructor(
		private fb: FormBuilder,
		private http: HttpClient,
		
		) {
			this._form =  this.fb.group({
				Producto : [null, Validators.required],
				Precio : [null, Validators.required],
				Peso: [null, Validators.required],
				Unidad_Peso: ["kg", Validators.required],
				Largo: [null, Validators.required],
				Ancho: [null, Validators.required],
				Profundidad: [null, Validators.required],
				Unidad_Medidas: ["cm", Validators.required],
			});
		}
		ngOnInit() {
			
			
			this._form.controls.Producto.valueChanges.pipe(debounceTime(400)).subscribe (valor => {this.buscar(valor); });
			this.loadParams();
			/*setTimeout(() => { //Le damos un tiempin para hacer foco, ya que la muy turra lo pierde luego con el autocomplete.
				this.input.focus();		
			}, 200);*/
			
		}
		loadParams () {
			let adr = "http://localhost/paramscalc";
			this.http.get(adr).subscribe(params=> {
				if (params) {
					this._globalParams = new CalcParams();
					this._globalParams.costoAduanaPorKilo = params[0].importe*1;
					this._globalParams.precioPrimerKilo = params[1].importe*1;
					this._globalParams.porcSeguroPM = params[2].importe*1;
					this._globalParams.porcSeguroAduana = params[3].importe*1;
					this._globalParams.precioKiloSiguientes = params[4].importe*1;
					this._globalParams.descPrimerEnvio = params[5].importe*1;
					console.log(this._globalParams);
				}
			});
		}

		buscar (name) {
			let adr = "http://localhost/pito";
			
			if (typeof name === "string") { //Filtremos la seleccion
				
				this.filteredOptions = this.http.get(adr);
			} else {
				this._ProductoElegido = name;	
			}
		}
		stopPropagation (event) {
			console.log(event);
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
			//CostoAduana:
			this._resultado.envioAduana = this._resultado.totalKilos*this._globalParams.costoAduanaPorKilo;

			console.log(this._resultado);
		}
		displayFn (campo?: ProductoData): string | undefined {
			return campo ? campo.descripcion : undefined;
		}
	}
	