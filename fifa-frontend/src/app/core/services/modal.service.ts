import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Tipos de modales
 */
export type ModalType = 'playerForm' | null;

/**
 * Datos que se pasan al modal
 */
export interface ModalData {
  type: ModalType;
  data?: any;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalSubject = new BehaviorSubject<ModalData>({ type: null });
  public modal$ = this.modalSubject.asObservable();

  /**
   * Abre un modal
   * @param type Tipo de modal
   * @param data Datos a pasar al modal
   * @param title Título del modal
   */
  openModal(type: ModalType, data?: any, title?: string): void {
    this.modalSubject.next({
      type,
      data,
      title
    });
  }

  /**
   * Cierra el modal actual
   */
  closeModal(): void {
    this.modalSubject.next({ type: null });
  }

  /**
   * Retorna el estado actual del modal
   */
  getModalState(): ModalData {
    return this.modalSubject.value;
  }
}
