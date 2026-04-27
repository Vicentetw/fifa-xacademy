import { Component, OnInit, Type } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ModalService, ModalData } from '../../../core/services/modal.service';
import { PlayerFormComponent } from '../../../features/players/player-form/player-form.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {
  
  modalData: ModalData = { type: null };
  isOpen = false;
  componentToRender: Type<any> | null = null;
  PlayerFormComponent = PlayerFormComponent;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modal$.subscribe((data) => {
      this.modalData = data;
      this.isOpen = data.type !== null;
      
      if (this.isOpen && data.type === 'playerForm') {
        this.componentToRender = PlayerFormComponent;
      } else {
        this.componentToRender = null;
      }
    });
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  /**
   * Cierra el modal si hace click fuera del contenedor
   */
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }
}
