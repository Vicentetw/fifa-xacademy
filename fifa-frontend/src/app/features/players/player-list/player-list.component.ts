import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersService } from '../services/players.service';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { Player, PlayersResponse } from '../../../core/models/player.model';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar/navbar.component';


@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.css'
})
export class PlayerListComponent implements OnInit {

  // 📊 Datos
  players: Player[] = [];
  isLoading = false;
  errorMessage = '';
  
  // 📑 Paginación
  currentPage = 1;
  limit = 10;
  totalPages = 0;

  constructor(
    private playersService: PlayersService,
    private authService: AuthService,
    private modalService: ModalService,
    private router: Router
  ) {}

  /**
   * Se ejecuta cuando el componente se inicializa
   * Carga la lista de jugadores
   */
  ngOnInit(): void {
    this.loadPlayers();
  }

  /**
   * Carga los jugadores desde el backend
   */
  loadPlayers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.playersService.getPlayers(this.currentPage, this.limit).subscribe({
      next: (response: PlayersResponse) => {
        this.players = response.data;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar jugadores';
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Elimina un jugador
   */
  deletePlayer(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este jugador?')) return;

    this.playersService.deletePlayer(id).subscribe({
      next: () => {
        this.loadPlayers(); // Recarga la lista
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar jugador';
        console.error(error);
      }
    });
  }
  /**
   * Abre el modal para editar un jugador
   */
  editPlayer(player: Player): void {
    this.modalService.openModal('playerForm', player, `✏️ Editar - ${player.name}`);
  }

  /**
   * Abre el modal para agregar un nuevo jugador
   */
  addPlayer(): void {
    this.modalService.openModal('playerForm', null, '➕ Agregar Jugador');
  }

  /**
   *cierra sesión ya lo pasé a navbar
   
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth']);
      },
      error: () => {
        this.router.navigate(['/auth']);
      }
    });
  }
*/
  /**
   * Navega a la página anterior
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPlayers();
    }
  }

  /**
   * Navega a la página siguiente
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPlayers();
    }
  }
}
