import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { trigger, style, animate, transition, query, stagger, state } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.css',
    animations: [
        trigger('fadeInUp', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(30px)' }),
                animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ]),
        trigger('staggerFadeIn', [
            transition(':enter', [
                query('.feature-card, .benefit-card, .stat', [
                    style({ opacity: 0, transform: 'translateY(30px)' }),
                    stagger('100ms', [
                        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ], { optional: true })
            ])
        ]),
        trigger('scrollAnimation', [
            state('hidden', style({ opacity: 0, transform: 'translateY(30px)' })),
            state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
            transition('hidden => visible', animate('0.8s ease-out'))
        ])
    ]
})
export class LandingComponent implements AfterViewInit {
    currentSlide = 0;
    slideInterval: any;

    @ViewChildren('animatedSection') animatedSections!: QueryList<ElementRef>;

    carouselImages = [
        { src: 'assets/images/carousel-1.jpg', alt: 'Medical Team' },
        { src: 'assets/images/carousel-2.jpg', alt: 'Hospital Corridor' },
        { src: 'assets/images/carousel-3.png', alt: 'Doctor with Tablet' },
        { src: 'assets/images/carousel-4.png', alt: 'Modern Healthcare' }
    ];

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

    feedbacks = [
        {
            name: 'Dr. Ricardo Mendes',
            role: 'Médico Cardiologista',
            image: 'assets/images/doctor-male.png',
            feedback: 'O SyncMed revolucionou a forma como gerencio meus plantões. Agora consigo visualizar toda minha agenda em um único lugar e aceitar oportunidades com apenas um clique. Altamente recomendado!'
        },
        {
            name: 'Dra. Ana Paula Costa',
            role: 'Médica Pediatra',
            image: 'assets/images/doctor-female.png',
            feedback: 'Excelente plataforma! A facilidade de acompanhar meus ganhos e horas trabalhadas me poupa muito tempo. O marketplace de plantões é uma funcionalidade incrível que me ajudou a otimizar minha renda.'
        },
        {
            name: 'Carlos Eduardo Silva',
            role: 'Coordenador Médico - Hospital Santa Cruz',
            image: 'assets/images/admin-male.png',
            feedback: 'Como coordenador, o SyncMed simplificou completamente nossa gestão de escalas. Reduzimos falhas de comunicação em 90% e conseguimos preencher plantões 3x mais rápido. A equipe está muito satisfeita!'
        },
        {
            name: 'Márcia Oliveira',
            role: 'Diretora Administrativa - Clínica Saúde Plus',
            image: 'assets/images/admin-female.png',
            feedback: 'Ferramenta indispensável para qualquer instituição de saúde moderna. Os relatórios em tempo real nos dão insights valiosos e a interface intuitiva facilitou a adoção por toda a equipe.'
        }
    ];

    currentFeedback = 0;
    feedbackInterval: any;

    constructor(private router: Router) { }

    ngOnInit() {
        this.startCarousel();
        this.startFeedbackCarousel();
    }

    ngAfterViewInit() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        this.animatedSections.forEach(section => {
            observer.observe(section.nativeElement);
        });
    }

    ngOnDestroy() {
        this.stopCarousel();
        this.stopFeedbackCarousel();
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

    startFeedbackCarousel() {
        this.feedbackInterval = setInterval(() => {
            this.nextFeedback();
        }, 6000);
    }

    stopFeedbackCarousel() {
        if (this.feedbackInterval) {
            clearInterval(this.feedbackInterval);
        }
    }

    nextFeedback() {
        this.currentFeedback = (this.currentFeedback + 1) % this.feedbacks.length;
    }

    prevFeedback() {
        this.currentFeedback = (this.currentFeedback - 1 + this.feedbacks.length) % this.feedbacks.length;
        this.stopFeedbackCarousel();
        this.startFeedbackCarousel();
    }

    nextFeedbackManual() {
        this.nextFeedback();
        this.stopFeedbackCarousel();
        this.startFeedbackCarousel();
    }

    setFeedback(index: number) {
        this.currentFeedback = index;
        this.stopFeedbackCarousel();
        this.startFeedbackCarousel();
    }

    navigateTo(route: string) {
        this.router.navigate([route]);
    }

    scrollToFeatures() {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }
}
