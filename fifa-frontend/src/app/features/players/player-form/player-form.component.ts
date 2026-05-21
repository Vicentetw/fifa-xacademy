import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PlayersService } from '../services/players.service';
import { ModalService } from '../../../core/services/modal.service';
import { Player } from '../../../core/models/player.model';

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
    fifa_update: ['', [Validators.required, Validators.minLength(1)]],
    player_face_url: ['', [Validators.required, Validators.minLength(5)]],
    overall: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    potential: ['', [Validators.required, Validators.min(0), Validators.max(99)]],
    age: ['', [Validators.required, Validators.min(16), Validators.max(99)]],
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
      // Convertir números a strings para el formulario
      this.form.patchValue({
        name: this.playerData.name,
        team: this.playerData.team,
        position: this.playerData.position,
        version: this.playerData.version?.toString(),
        fifa_update: this.playerData.fifa_update || '',
        player_face_url: this.playerData.player_face_url || '',
        overall: this.playerData.overall?.toString() || '',
        potential: this.playerData.potential?.toString() || '',
        age: this.playerData.age?.toString() || '',
        pace: this.playerData.pace?.toString(),
        shooting: this.playerData.shooting?.toString(),
        passing: this.playerData.passing?.toString(),
        dribbling: this.playerData.dribbling?.toString(),
        defending: this.playerData.defending?.toString(),
        physical: this.playerData.physical?.toString()
      });
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
    if (field.errors['min']) {
      if (fieldName === 'version') return 'La versión debe ser mayor a 19';
      return `Valor mínimo: ${field.errors['min'].min}`;
    }
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

    const formValue = this.form.value;
    
    // Convertir strings a números
    const playerData: Player = {
      name: formValue.name || '',
      team: formValue.team || '',
      position: formValue.position || '',
      version: parseInt(formValue.version || '0'),
      fifa_update: formValue.fifa_update || '',
      player_face_url: formValue.player_face_url || '',
      overall: parseInt(formValue.overall || '0'),
      potential: parseInt(formValue.potential || '0'),
      age: parseInt(formValue.age || '0'),
      pace: parseInt(formValue.pace || '0'),
      shooting: parseInt(formValue.shooting || '0'),
      passing: parseInt(formValue.passing || '0'),
      dribbling: parseInt(formValue.dribbling || '0'),
      defending: parseInt(formValue.defending || '0'),
      physical: parseInt(formValue.physical || '0')
    };

    if (this.isEditMode && this.playerData?.id) {
      // EDITAR
      this.playersService.updatePlayer(this.playerData.id, playerData).subscribe({
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
      this.playersService.createPlayer(playerData).subscribe({
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
