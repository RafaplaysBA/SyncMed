import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

interface ScheduleShift {
    id: number;
    date: string;
    dayOfWeek: string;
    hospital: string;
    time: string;
    specialty: string;
    value: number;
    status: 'upcoming' | 'completed' | 'cancelled';
}

@Component({
    selector: 'app-doctor-schedule',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    templateUrl: './doctor-schedule.component.html',
    styleUrl: './doctor-schedule.component.css'
})
export class DoctorScheduleComponent {
    currentMonth = 'Novembro 2025';
    filter: 'all' | 'upcoming' | 'completed' = 'all';

    shifts: ScheduleShift[] = [
        { id: 1, date: '2025-11-25', dayOfWeek: 'Segunda', hospital: 'Hospital São Lucas', time: '08:00 - 20:00', specialty: 'Cardiologia', value: 1200, status: 'upcoming' },
        { id: 2, date: '2025-11-27', dayOfWeek: 'Quarta', hospital: 'Hospital Central', time: '14:00 - 22:00', specialty: 'Emergência', value: 1500, status: 'upcoming' },
        { id: 3, date: '2025-11-29', dayOfWeek: 'Sexta', hospital: 'Clínica Santa Maria', time: '08:00 - 16:00', specialty: 'Cardiologia', value: 1000, status: 'upcoming' },
        { id: 4, date: '2025-11-23', dayOfWeek: 'Sábado', hospital: 'Hospital São Lucas', time: '20:00 - 08:00', specialty: 'Emergência', value: 1800, status: 'completed' },
        { id: 5, date: '2025-11-20', dayOfWeek: 'Quarta', hospital: 'Hospital Central', time: '08:00 - 18:00', specialty: 'Cardiologia', value: 1200, status: 'completed' },
        { id: 6, date: '2025-11-18', dayOfWeek: 'Segunda', hospital: 'Clínica Santa Maria', time: '14:00 - 22:00', specialty: 'Clínica Geral', value: 900, status: 'completed' }
    ];

    constructor(private router: Router) { }

    setFilter(filter: 'all' | 'upcoming' | 'completed') {
        this.filter = filter;
    }

    getFilteredShifts(): ScheduleShift[] {
        if (this.filter === 'all') return this.shifts;
        return this.shifts.filter(shift => shift.status === this.filter);
    }

    getTotalShifts(): number {
        return this.shifts.length;
    }

    getUpcomingCount(): number {
        return this.shifts.filter(shift => shift.status === 'upcoming').length;
    }

    getCompletedCount(): number {
        return this.shifts.filter(shift => shift.status === 'completed').length;
    }

    getTotalValue(): number {
        return this.shifts.reduce((sum, shift) => sum + shift.value, 0);
    }

    getDay(dateString: string): string {
        const date = new Date(dateString);
        return date.getDate().toString().padStart(2, '0');
    }

    getMonthName(dateString: string): string {
        const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
        const date = new Date(dateString);
        return months[date.getMonth()];
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            'upcoming': 'Próximo',
            'completed': 'Concluído',
            'cancelled': 'Cancelado'
        };
        return labels[status] || status;
    }

    previousMonth() {
        console.log('Previous month');
    }

    nextMonth() {
        console.log('Next month');
    }

    viewDetails(id: number) {
        console.log('View details:', id);
    }

    cancelShift(id: number) {
        if (confirm('Tem certeza que deseja cancelar este plantão?')) {
            const shift = this.shifts.find(s => s.id === id);
            if (shift) shift.status = 'cancelled';
        }
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }
}
