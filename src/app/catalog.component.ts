import { Component, Input, OnInit } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})

export class CatalogComponent implements OnInit {

  @Input() apiUrl?: string;

  // это Observable в компоненте, который будет получать данные от сервиса. По умолчанию равен NEVER и никогда не выдаст результат.
  public entries$: Observable<any> = NEVER;

  constructor(private ss: StorageService) {
  }

  ngOnInit() {
    console.log('CatalogComponent OnInit');
    if (this.apiUrl) {
      // проверяем, заполнен ли url для получения данных, если да, то обращаемся к сервису
      this.entries$ = this.ss.getCollection(this.apiUrl);
    }
  }

}
