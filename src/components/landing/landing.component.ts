import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css'
})
export class LandingComponent {
    carouselImages = [
        { src: 'assets/images/carousel-1.jpg', alt: 'Medical Team' },
        { src: 'assets/images/carousel-2.jpg', alt: 'Hospital Corridor' },
        { src: 'assets/images/carousel-3.png', alt: 'Doctor with Tablet' },
        { src: 'assets/images/carousel-4.png', alt: 'Modern Healthcare' }
    ];

    currentSlide = 0;
    slideInterval: any;

    features = [
        {
            icon: '📋',
            title: 'Publicação Rápida',
            description: 'Crie e publique plantões em segundos com formulário intuitivo'
        },
        {
            icon: '📅',
            title: 'Gestão Completa',
            description: 'Visualize todas as escalas e plantões em uma interface limpa'
        },
        {
            icon: '🔔',
            title: 'Notificações em Tempo Real',
            description: 'Receba alertas instantâneos sobre novos plantões e atualizações'
        },
        {
            icon: '💰',
            title: 'Controle Financeiro',
            description: 'Acompanhe valores e horas trabalhadas automaticamente'
        },
        {
            icon: '🏥',
            title: 'Multi-Hospital',
            description: 'Gerencie plantões de múltiplos hospitais em um único lugar'
        },
        {
            icon: '📊',
            title: 'Relatórios Inteligentes',
            description: 'Métricas e insights para otimizar sua gestão'
        }
    ];

    constructor(private router: Router) { }

    ngOnInit() {
        this.startCarousel();
    }

    ngOnDestroy() {
        this.stopCarousel();
    }

    startCarousel() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopCarousel() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.carouselImages.length;
    }

    setSlide(index: number) {
        this.currentSlide = index;
        this.stopCarousel();
        this.startCarousel();
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    scrollToFeatures() {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }
}
