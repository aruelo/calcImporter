import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'app-dialog-resultado',
  templateUrl: './dialog-resultado.component.html',
  styleUrls: ['./dialog-resultado.component.css']
})
export class DialogResultadoComponent implements OnInit {

  constructor(
	@Inject(MAT_DIALOG_DATA) public _resultado: any
  ) { }

  ngOnInit() {
  }

}
