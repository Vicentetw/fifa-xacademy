import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayersService } from '../services/players.service';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { Player, PlayersResponse } from '../../../core/models/player.model';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar/navbar.component';


@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
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

  // 🔍 Filtros
  filterName = '';
  filterTeam = '';
  filterPosition = '';
  filterVersion = '';
  isDownloading = false;

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

    const filters = {
      name: this.filterName || undefined,
      team: this.filterTeam || undefined,
      position: this.filterPosition || undefined,
      version: this.filterVersion || undefined
    };

    this.playersService.getPlayers(this.currentPage, this.limit, filters).subscribe({
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
    if (!player.id) {
      this.errorMessage = 'ID de jugador no válido';
      return;
    }

    this.isLoading = true;
    this.playersService.getPlayerById(player.id).subscribe({
      next: (fullPlayer) => {
        this.modalService.openModal('playerForm', fullPlayer, `✏️ Editar - ${fullPlayer.name}`);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar datos del jugador';
        console.error(error);
        this.isLoading = false;
      }
    });
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

  /**
   * Descarga CSV con filtros actuales
   */
  downloadCSV(): void {
    this.isDownloading = true;

    const filters = {
      name: this.filterName || undefined,
      team: this.filterTeam || undefined,
      position: this.filterPosition || undefined,
      version: this.filterVersion || undefined
    };

    this.playersService.downloadCSV(filters).subscribe({
      next: (blob: Blob) => {
        // Crear URL temporal
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `players_${new Date().getTime()}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isDownloading = false;
      },
      error: (error) => {
        console.error('Error descargando CSV:', error);
        this.errorMessage = 'Error al descargar CSV';
        this.isDownloading = false;
      }
    });
  }

  /**
   * Limpia todos los filtros y recarga la lista
   */
  clearFilters(): void {
    this.filterName = '';
    this.filterTeam = '';
    this.filterPosition = '';
    this.filterVersion = '';
    this.currentPage = 1;
    this.loadPlayers();
  }

  /**
   * Navega al detalle de un jugador
   */
  viewDetail(id: number): void {
    this.router.navigate(['/players', id]);
  }
}
