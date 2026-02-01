import type { ProjetPFE, RendezVous } from '../types';
import { MOCK_PROJETS, MOCK_RENDEZVOUS } from '../data/mockProjects';

const STORAGE_KEYS = {
    PROJECTS: 'pfe_projects',
    APPOINTMENTS: 'pfe_appointments',
    NOTIFICATIONS: 'pfe_notifications'
};

export const storageService = {
    // INITIALISATION
    init() {
        const VERSION = 'v2.0_clean'; // Nouvelle version pour forcer le reset
        if (localStorage.getItem('pfe_storage_version') !== VERSION) {
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(MOCK_PROJETS));
            localStorage.setItem('pfe_storage_version', VERSION);
            // On peut garder les notifications et RDV si déjà présents, ou tout reset
        }

        if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
            localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(MOCK_RENDEZVOUS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
        }
    },

    // PROJETS
    getProjects(): ProjetPFE[] {
        const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        return data ? JSON.parse(data) : [];
    },

    syncStudentName(studentId: string, newName: string) {
        const projects = this.getProjects();
        const index = projects.findIndex(p => p.idEtudiant === studentId);
        if (index !== -1) {
            projects[index].nomEtudiant = newName;
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        }
    },

    getProjectById(id: string): ProjetPFE | undefined {
        return this.getProjects().find(p => p.id === id);
    },

    getProjectByStudent(studentId: string): ProjetPFE | undefined {
        return this.getProjects().find(p => p.idEtudiant === studentId);
    },

    updateProject(updatedProject: ProjetPFE) {
        const projects = this.getProjects();
        const index = projects.findIndex(p => p.id === updatedProject.id);
        if (index !== -1) {
            projects[index] = updatedProject;
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
        }
    },

    // RENDEZ-VOUS
    getAppointments(): RendezVous[] {
        const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
        return data ? JSON.parse(data) : [];
    },

    addAppointment(appointment: RendezVous) {
        const apps = this.getAppointments();
        apps.push(appointment);
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apps));
    },

    updateAppointment(id: string, updates: Partial<RendezVous>) {
        const apps = this.getAppointments();
        const index = apps.findIndex(a => a.id === id);
        if (index !== -1) {
            apps[index] = { ...apps[index], ...updates };
            localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(apps));
        }
    },

    // NOTIFICATIONS GLOBALES
    getNotifications(): any[] {
        const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        return data ? JSON.parse(data) : [];
    },

    addNotification(notification: any) {
        const notes = this.getNotifications();
        notes.unshift(notification); // Plus récent en haut
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notes.slice(0, 5))); // On garde les 5 dernières
    },

    clearNotifications() {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    }
};
