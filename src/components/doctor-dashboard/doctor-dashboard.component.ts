import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Shift, ShiftService } from '../../services/shift.service';

interface FinancialSummary {
    title: string;
    value: string;
    icon: string;
    subtitle?: string;
}

@Component({
    selector: 'app-doctor-dashboard',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    templateUrl: './doctor-dashboard.component.html',
    styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent implements OnInit {
    doctorName = 'Doutor';
    financialSummary: FinancialSummary[] = [];
    upcomingShifts: Shift[] = [];
    monthlyStats = { count: 0, hours: 0, earnings: 0, average: 0 };

    recentActivity = [
        { icon: '✅', title: 'Plantão Aceito', description: 'Hospital São Lucas - 25/11', time: 'Há 2 horas', color: '#e8f5e9' },
        { icon: '💰', title: 'Pagamento Recebido', description: 'R$ 1.200 - Hospital Central', time: 'Há 5 horas', color: '#e3f2fd' },
        { icon: '📋', title: 'Novo Plantão Disponível', description: 'Clínica Santa Maria - 30/11', time: 'Há 1 dia', color: '#fff3e0' }
    ];

    constructor(
        private router: Router,
        private shiftService: ShiftService
    ) { }

    ngOnInit() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            this.doctorName = user.name;

            this.shiftService.shifts$.subscribe(shifts => {
                // Filtrar plantões atribuídos a este médico (pelo email/id)
                const myShifts = shifts.filter(s => s.assignedDoctorId === user.email);
                this.updateDashboard(myShifts);
            });
        }
    }

    updateDashboard(shifts: Shift[]) {
        // Próximos plantões (ordenados por data)
        this.upcomingShifts = shifts
            .filter(s => new Date(s.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3);

        // Estatísticas Mensais (Simuladas com base no total)
        const totalEarnings = shifts.reduce((sum, s) => sum + s.value, 0);
        const totalHours = shifts.length * 12; // Média de 12h por plantão

        this.monthlyStats = {
            count: shifts.length,
            hours: totalHours,
            earnings: totalEarnings,
            average: shifts.length > 0 ? Math.round(totalEarnings / shifts.length) : 0
        };

        this.financialSummary = [
            { title: 'Ganhos do Mês', value: `R$ ${totalEarnings}`, icon: '💰', subtitle: 'Novembro 2025' },
            { title: 'Horas do Mês', value: `${totalHours}h`, icon: '⏱️', subtitle: `${shifts.length} plantões` },
            { title: 'Próximo Plantão', value: this.upcomingShifts[0] ? this.getDay(this.upcomingShifts[0].date) + '/' + this.getMonth(this.upcomingShifts[0].date) : '--/--', icon: '📅', subtitle: this.upcomingShifts[0]?.hospital || 'Nenhum agendado' },
            { title: 'Taxa de Aceitação', value: '100%', icon: '✅', subtitle: 'Últimos 30 dias' }
        ];
    }

    getDay(dateString: string): string {
        return new Date(dateString).getDate().toString().padStart(2, '0');
    }

    getMonth(dateString: string): string {
        return new Date(dateString).toLocaleString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }
}
