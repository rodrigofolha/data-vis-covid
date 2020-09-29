import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  setGroupFilter$ = new Subject<any>();
  getGroupFilter = this.setGroupFilter$.asObservable();

  constructor() { }
  changeGraphs(): Observable<any> {
    return of('ok');
   }
}
