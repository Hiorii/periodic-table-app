import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  public spinnerSignal: WritableSignal<boolean> = signal(false);

  spinnerStart() {
    this.spinnerSignal.set(true);
  }

  spinnerStop() {
    this.spinnerSignal.set(false);
  }
}
