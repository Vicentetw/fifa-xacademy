import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player, PlayersResponse } from '../../../core/models/player.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {

  /*private API_URL = 'http://localhost:3000/api/players';*/
  private API_URL = `${environment.apiUrl}/players`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los jugadores con paginación y filtros
   * @param page Página actual (default: 1)
   * @param limit Límite por página (default: 10)
   * @param filters Filtros: name, team, position, version
   */
  getPlayers(page = 1, limit = 10, filters?: any): Observable<PlayersResponse> {
    let url = `${this.API_URL}?page=${page}&limit=${limit}`;
    
    if (filters?.name) url += `&name=${filters.name}`;
    if (filters?.team) url += `&team=${filters.team}`;
    if (filters?.position) url += `&position=${filters.position}`;
    if (filters?.version) url += `&version=${filters.version}`;

    return this.http.get<PlayersResponse>(url, { 
      withCredentials: true 
    });
  }

  /**
   * Obtiene un jugador por ID
   */
  getPlayerById(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.API_URL}/${id}`, { 
      withCredentials: true 
    });
  }

  /**
   * Crea un nuevo jugador
   */
  createPlayer(player: Player): Observable<any> {
    return this.http.post(
      this.API_URL,
      player,
      { withCredentials: true }
    );
  }

  /**
   * Actualiza un jugador existente
   */
  updatePlayer(id: number, player: Player): Observable<Player> {
    return this.http.put<Player>(
      `${this.API_URL}/${id}`,
      player,
      { withCredentials: true }
    );
  }

  /**
   * Elimina un jugador
   */
  deletePlayer(id: number): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/${id}`,
      { withCredentials: true }
    );
  }

  /**
   * Descarga CSV con los jugadores filtrados
   * @param filters Filtros: name, team, position, version
   */
  downloadCSV(filters?: any): Observable<Blob> {
    let url = `${this.API_URL}/export/csv`;
    
    if (filters?.name) url += `?name=${filters.name}`;
    if (filters?.team) url += (filters?.name ? '&' : '?') + `team=${filters.team}`;
    if (filters?.position) url += (filters?.name || filters?.team ? '&' : '?') + `position=${filters.position}`;
    if (filters?.version) url += (filters?.name || filters?.team || filters?.position ? '&' : '?') + `version=${filters.version}`;

    return this.http.get<Blob>(url, { 
      withCredentials: true,
      responseType: 'blob' as 'json'
    });
  }
}
