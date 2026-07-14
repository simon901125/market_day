import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrganizerProfileDialogService {
  private readonly openRequestedSubject = new Subject<void>();

  readonly openRequested$ = this.openRequestedSubject.asObservable();

  open(): void {
    this.openRequestedSubject.next();
  }
}
