import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Shift, ShiftService } from '../../services/shift.service';

@Component({
    selector: 'app-admin-shifts',
    standalone: true,
    imports: [CommonModule, FormsModule, HeaderComponent],
    templateUrl: './admin-shifts.component.html',
    styleUrl: './admin-shifts.component.css'
})
export class AdminShiftsComponent implements OnInit {
    newShift = {
        hospital: '',
        date: '',
        time: '',
        specialty: '',
        value: 0
    };

    filter: 'all' | 'open' | 'filled' = 'all';
    shifts: Shift[] = [];

    constructor(
        private router: Router,
        private shiftService: ShiftService
    ) { }

    ngOnInit() {
        this.shiftService.shifts$.subscribe(shifts => {
            this.shifts = shifts;
        });
    }

    publishShift() {
        if (this.newShift.hospital && this.newShift.date && this.newShift.time && this.newShift.specialty && this.newShift.value) {
            this.shiftService.addShift(this.newShift);

            this.newShift = {
                hospital: '',
                date: '',
                time: '',
                specialty: '',
                value: 0
            };

            alert('Plantão publicado com sucesso!');
        }
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    setFilter(filter: 'all' | 'open' | 'filled') {
        this.filter = filter;
    }

    getFilteredShifts(): Shift[] {
        if (this.filter === 'all') return this.shifts;
        return this.shifts.filter(shift => shift.status === this.filter);
    }

    getOpenCount(): number {
        return this.shifts.filter(shift => shift.status === 'open').length;
    }

    getFilledCount(): number {
        return this.shifts.filter(shift => shift.status === 'filled').length;
    }

    deleteShift(id: number) {
        if (confirm('Tem certeza que deseja remover este plantão?')) {
            this.shiftService.deleteShift(id);
        }
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }
}
