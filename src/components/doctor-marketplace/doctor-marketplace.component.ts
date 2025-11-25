import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Shift, ShiftService } from '../../services/shift.service';

@Component({
    selector: 'app-doctor-marketplace',
    standalone: true,
    imports: [CommonModule, FormsModule, HeaderComponent],
    templateUrl: './doctor-marketplace.component.html',
    styleUrl: './doctor-marketplace.component.css'
})
export class DoctorMarketplaceComponent implements OnInit {
    availableShifts: Shift[] = [];
    filteredShifts: Shift[] = [];

    filters = {
        specialty: '',
        minValue: 0,
        dateFrom: ''
    };

    constructor(
        private router: Router,
        private shiftService: ShiftService
    ) { }

    ngOnInit() {
        this.shiftService.shifts$.subscribe(shifts => {
            // Filtrar apenas plantões abertos
            this.availableShifts = shifts.filter(s => s.status === 'open');
            this.applyFilters();
        });
    }

    applyFilters() {
        this.filteredShifts = this.availableShifts.filter(shift => {
            if (this.filters.specialty && shift.specialty !== this.filters.specialty) {
                return false;
            }
            if (this.filters.minValue && shift.value < this.filters.minValue) {
                return false;
            }
            if (this.filters.dateFrom && shift.date < this.filters.dateFrom) {
                return false;
            }
            return true;
        });
    }

    clearFilters() {
        this.filters = {
            specialty: '',
            minValue: 0,
            dateFrom: ''
        };
        this.applyFilters();
    }

    getNewShiftsCount(): number {
        // Simulação: plantões criados hoje
        const today = new Date().toISOString().split('T')[0];
        // Como não temos data de criação, vamos assumir que plantões para datas futuras próximas são "novos"
        return this.availableShifts.filter(s => s.date >= today).length;
    }

    getAverageValue(): number {
        if (this.availableShifts.length === 0) return 0;
        const total = this.availableShifts.reduce((sum, shift) => sum + shift.value, 0);
        return Math.round(total / this.availableShifts.length);
    }

    isNew(shift: Shift): boolean {
        // Simulação visual
        return shift.id > 5;
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    acceptShift(id: number) {
        if (confirm('Deseja aceitar este plantão?')) {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : { name: 'Dr. Desconhecido', email: 'doctor' };

            this.shiftService.assignDoctor(id, user.name, user.email);
            alert('Plantão aceito com sucesso! Você pode visualizá-lo na sua agenda.');
        }
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }
}
