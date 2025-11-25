import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Shift, ShiftService } from '../../services/shift.service';

interface MetricCard {
    title: string;
    value: number;
    icon: string;
    trend?: string;
}

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
    metrics: MetricCard[] = [];
    recentShifts: Shift[] = [];

    waitingDoctors = [
        { id: 1, name: 'Dr. Carlos Silva', specialty: 'Cardiologia', email: 'carlos.silva@email.com' },
        { id: 2, name: 'Dra. Maria Santos', specialty: 'Pediatria', email: 'maria.santos@email.com' },
        { id: 3, name: 'Dr. João Oliveira', specialty: 'Ortopedia', email: 'joao.oliveira@email.com' }
    ];

    constructor(
        private router: Router,
        private shiftService: ShiftService
    ) { }

    ngOnInit() {
        this.shiftService.shifts$.subscribe(shifts => {
            this.recentShifts = shifts.slice(0, 5);
            this.updateMetrics(shifts);
        });
    }

    updateMetrics(shifts: Shift[]) {
        const totalShifts = shifts.length;
        const filledShifts = shifts.filter(s => s.status === 'filled').length;
        const fillRate = totalShifts > 0 ? Math.round((filledShifts / totalShifts) * 100) : 0;

        this.metrics = [
            { title: 'Total de Médicos', value: 48, icon: '👨‍⚕️', trend: '+5 este mês' },
            { title: 'Médicos em Espera', value: this.waitingDoctors.length, icon: '⏳', trend: 'Aguardando aprovação' },
            { title: 'Plantões Ativos', value: totalShifts, icon: '📋', trend: `+${shifts.length} total` },
            { title: 'Taxa de Preenchimento', value: fillRate, icon: '✅', trend: `${fillRate}%` }
        ];
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    approveDoctor(id: number) {
        console.log('Approving doctor:', id);
        this.waitingDoctors = this.waitingDoctors.filter(d => d.id !== id);
        this.updateMetrics(this.shiftService.getShifts());
    }

    rejectDoctor(id: number) {
        console.log('Rejecting doctor:', id);
        this.waitingDoctors = this.waitingDoctors.filter(d => d.id !== id);
        this.updateMetrics(this.shiftService.getShifts());
    }
}
