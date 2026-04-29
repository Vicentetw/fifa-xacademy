import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../services/players.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { NavbarComponent } from '../../../shared/components/navbar/navbar/navbar.component';

// Registrar todos los elementos necesarios de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, NavbarComponent],
  templateUrl: './player-detail.component.html',
  styleUrl: './player-detail.component.css'
})
export class PlayerDetailComponent implements OnInit {
  playerData: any = null;
  isLoading = true;
  errorMessage = '';
  playerId: number = 0;

  // Configuración del gráfico Radar
  radarChartData: ChartConfiguration<'radar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Skills',
        data: [],
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: '#FF6B6B',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#FF6B6B',
      }
    ]
  };

  radarChartOptions: ChartConfiguration<'radar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 99,
        ticks: {
          stepSize: 20,
          color: '#999'
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)'
        },
        pointLabels: {
          color: '#333',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private playersService: PlayersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && !isNaN(Number(id))) {
        this.playerId = Number(id);
        this.loadPlayerDetail();
      } else {
        this.errorMessage = 'ID inválido';
        this.isLoading = false;
      }
    });
  }

  loadPlayerDetail(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.playersService.getPlayerById(this.playerId).subscribe({
      next: (response: any) => {
        this.playerData = response;
        
        // Actualizar datos del gráfico
        if (response.skills && response.skills.labels && response.skills.values) {
          const labels = response.skills.labels.map((label: string) => 
            label.charAt(0).toUpperCase() + label.slice(1)
          );
          
          // Crear nueva referencia para que Angular detecte el cambio
          this.radarChartData = {
            labels: labels,
            datasets: [
              {
                label: 'Skills',
                data: response.skills.values,
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: '#FF6B6B',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#FF6B6B',
              }
            ]
          };
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener jugador:', error);
        this.errorMessage = 'Error al cargar los detalles del jugador';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/players']);
  }
}
