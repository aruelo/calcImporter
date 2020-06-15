import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'calc-importer';
  _form: FormGroup;

	constructor(
		private fb: FormBuilder,

	) {
		this._form =  this.fb.group({
			Categoria : [null, Validators.required],
			Precio : [null, Validators.required],
			Peso: [null, Validators.required],
			Unidad_Peso: [null, Validators.required],
			Largo: [null, Validators.required],
			Ancho: [null, Validators.required],
			Profundidad: [null, Validators.required],
			Unidad_Medidas: [null, Validators.required],
		});
	}
	protected _doCalc () {
		console.log("PITO");
		console.log(this._form.value);
	}
}
