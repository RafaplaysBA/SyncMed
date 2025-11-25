import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Shift {
    id: number;
    hospital: string;
    date: string;
    time: string;
    specialty: string;
    value: number;
    status: 'open' | 'filled';
    assignedDoctor?: string;
    assignedDoctorId?: string;
    description?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ShiftService {
    private shiftsSubject = new BehaviorSubject<Shift[]>([]);
    public shifts$ = this.shiftsSubject.asObservable();

    constructor() {
        this.loadShifts();
    }

    private loadShifts() {
        const savedShifts = localStorage.getItem('shifts');
        if (savedShifts) {
            this.shiftsSubject.next(JSON.parse(savedShifts));
        } else {
            // Dados iniciais (Mock)
            const initialShifts: Shift[] = [
                { id: 1, hospital: 'Hospital São Lucas', date: '2025-11-25', time: '08:00', specialty: 'Cardiologia', value: 1200, status: 'filled', assignedDoctor: 'Dr. Fernando', assignedDoctorId: 'doctor' },
                { id: 2, hospital: 'Hospital Central', date: '2025-11-25', time: '20:00', specialty: 'Emergência', value: 1500, status: 'open' },
                { id: 3, hospital: 'Clínica Santa Maria', date: '2025-11-26', time: '08:00', specialty: 'Pediatria', value: 1000, status: 'open' },
                { id: 4, hospital: 'Hospital São Lucas', date: '2025-11-26', time: '14:00', specialty: 'Ortopedia', value: 1300, status: 'filled', assignedDoctor: 'Dra. Maria Santos', assignedDoctorId: 'other' },
                { id: 5, hospital: 'Hospital Central', date: '2025-11-27', time: '08:00', specialty: 'Clínica Geral', value: 900, status: 'open' }
            ];
            this.saveShifts(initialShifts);
        }
    }

    private saveShifts(shifts: Shift[]) {
        localStorage.setItem('shifts', JSON.stringify(shifts));
        this.shiftsSubject.next(shifts);
    }

    getShifts(): Shift[] {
        return this.shiftsSubject.value;
    }

    addShift(shift: Omit<Shift, 'id' | 'status'>) {
        const currentShifts = this.getShifts();
        const newShift: Shift = {
            ...shift,
            id: Date.now(), // ID simples baseado em timestamp
            status: 'open'
        };
        this.saveShifts([newShift, ...currentShifts]);
    }

    deleteShift(id: number) {
        const currentShifts = this.getShifts();
        const updatedShifts = currentShifts.filter(s => s.id !== id);
        this.saveShifts(updatedShifts);
    }

    assignDoctor(shiftId: number, doctorName: string, doctorId: string) {
        const currentShifts = this.getShifts();
        const updatedShifts = currentShifts.map(shift => {
            if (shift.id === shiftId) {
                return {
                    ...shift,
                    status: 'filled' as const,
                    assignedDoctor: doctorName,
                    assignedDoctorId: doctorId
                };
            }
            return shift;
        });
        this.saveShifts(updatedShifts);
    }

    getDoctorShifts(doctorId: string): Shift[] {
        return this.getShifts().filter(s => s.assignedDoctorId === doctorId);
    }
}
