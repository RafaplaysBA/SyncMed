import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    @Input() userType: 'guest' | 'admin' | 'doctor' = 'guest';
    mobileMenuOpen = false;

    constructor(private router: Router) { }

    toggleMobileMenu() {
        this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    navigateTo(route: string) {
        this.mobileMenuOpen = false;
        this.router.navigate([route]);
    }

    logout() {
        this.mobileMenuOpen = false;
        localStorage.removeItem('user');
        this.router.navigate(['/']);
    }
}
