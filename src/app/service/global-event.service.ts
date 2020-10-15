import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalEventService {
  private reloadTableSource = new BehaviorSubject<void>(null);
  public reloadTableEvent: Observable<
    void
  > = this.reloadTableSource.asObservable();

  constructor() {}

  public sendReloadTableEvent(): void {
    this.reloadTableSource.next();
  }
}
