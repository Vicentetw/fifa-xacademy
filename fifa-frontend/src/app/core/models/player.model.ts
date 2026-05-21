/**
 * Modelo de Jugador
 */
export interface Player {
  id?: number;
  name: string;
  team: string;
  position: string;
  version: number;
  fifa_update?: string;
  player_face_url?: string;
  overall?: number;
  potential?: number;
  age?: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  created_at?: string;
}

/**
 * Respuesta de paginación del backend
 */
export interface PlayersResponse {
  total: number;
  page: number;
  totalPages: number;
  data: Player[];
}
