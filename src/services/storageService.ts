import type { ProjetPFE, RendezVous } from '../types';
import { MOCK_PROJETS, MOCK_RENDEZVOUS } from '../data/mockProjects';

const STORAGE_KEYS = {
    PROJECTS: 'pfe_projects',
    APPOINTMENTS: 'pfe_appointments',
    NOTIFICATIONS: 'pfe_notifications',
    FICHES: 'pfe_fiches_suivi'
};

export const storageService = {
    // INITIALISATION
    init() {
        const VERSION = 'v2.14_document_links'; // Force cleanup of test data
        const currentVersion = localStorage.getItem('pfe_storage_version');

        if (currentVersion !== VERSION) {
            console.log('Resetting storage to version:', VERSION);
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(MOCK_PROJETS));
            localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(MOCK_RENDEZVOUS));
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
            localStorage.setItem('pfe_storage_version', VERSION);
        }

        if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
            localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(MOCK_RENDEZVOUS));
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
    },

    // GESTION DES DOCUMENTS
    addDocumentToProject(projectId: string, document: { name: string; url: string; type: 'rapport' | 'presentation' | 'annexe' | 'autre' }) {
        const projects = this.getProjects();
        const projectIndex = projects.findIndex(p => p.id === projectId);

        if (projectIndex !== -1) {
            const newDoc = {
                id: `doc-${Date.now()}`,
                name: document.name,
                url: document.url,
                date: new Date().toISOString().split('T')[0],
                type: document.type
            };

            if (!projects[projectIndex].documents) {
                projects[projectIndex].documents = [];
            }

            projects[projectIndex].documents!.push(newDoc);
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
            return newDoc;
        }
        return null;
    },

    deleteDocumentFromProject(projectId: string, documentId: string) {
        const projects = this.getProjects();
        const projectIndex = projects.findIndex(p => p.id === projectId);

        if (projectIndex !== -1 && projects[projectIndex].documents) {
            projects[projectIndex].documents = projects[projectIndex].documents!.filter(
                doc => doc.id !== documentId
            );
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
            return true;
        }
        return false;
    },

    getDocumentsByProject(projectId: string) {
        const project = this.getProjectById(projectId);
        return project?.documents || [];
    },

    // FICHE SUIVI PFE
    getFicheSuivi(projectId: string): any | null {
        const data = localStorage.getItem(STORAGE_KEYS.FICHES);
        const fiches = data ? JSON.parse(data) : {};
        return fiches[projectId] || null;
    },

    saveFicheSuivi(fiche: any) {
        const data = localStorage.getItem(STORAGE_KEYS.FICHES);
        const fiches = data ? JSON.parse(data) : {};
        fiches[fiche.projectId] = fiche;
        localStorage.setItem(STORAGE_KEYS.FICHES, JSON.stringify(fiches));
    }
};
