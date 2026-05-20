import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlayersService } from '../../services/players.service';
import { ModalService } from '../../../../core/services/modal.service';
import { Player } from '../../../../core/models/player.model';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.css'
})
export class PlayerFormComponent implements OnInit {

  @Input() playerData?: Player;

  isLoading = false;
  errorMessage = '';
  isEditMode = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    team: ['', [Validators.required, Validators.minLength(2)]],
    position: ['', [Validators.required]],
    version: ['', [Validators.required, Validators.min(20)]],
    pace: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    shooting: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    passing: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    dribbling: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    defending: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    physical: ['', [Validators.required, Validators.min(0), Validators.max(99)]]
  });

  constructor(
    private fb: FormBuilder,
    private playersService: PlayersService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    if (this.playerData) {
      this.isEditMode = true;
      this.form.patchValue(this.playerData);
    }
  }

  /**
   * Valida si un campo tiene error
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Retorna el mensaje de error específico del campo
   */
  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return `${fieldName} es requerido`;
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['min']) return `Valor mínimo: ${field.errors['min'].min}`;
    if (field.errors['max']) return `Valor máximo: ${field.errors['max'].max}`;
    return 'Campo inválido';
  }

  /**
   * Guarda o actualiza el jugador
   */
  submitForm(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.form.value as Player;

    if (this.isEditMode && this.playerData?.id) {
      // EDITAR
      this.playersService.updatePlayer(this.playerData.id, formValue).subscribe({
        next: () => {
          this.modalService.closeModal();
          window.location.reload(); // Recarga la lista
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al actualizar jugador';
          this.isLoading = false;
        }
      });
    } else {
      // CREAR
      this.playersService.createPlayer(formValue).subscribe({
        next: () => {
          this.modalService.closeModal();
          window.location.reload(); // Recarga la lista
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al crear jugador';
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Cancela y cierra el modal
   */
  cancel(): void {
    this.modalService.closeModal();
  }
}
