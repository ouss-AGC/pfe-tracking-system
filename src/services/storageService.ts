import type { ProjetPFE, RendezVous } from '../types';
import { MOCK_RENDEZVOUS, MOCK_PROJETS } from '../data/mockProjects';

const STORAGE_KEYS = {
    PROJECTS: 'pfe_projects',
    APPOINTMENTS: 'pfe_appointments',
    NOTIFICATIONS: 'pfe_notifications',
    FICHES: 'pfe_fiches_suivi',
    USERS: 'pfe_users'
};

export const storageService = {
    // INITIALISATION
    // INITIALISATION
    init() {
        // PERMANENT STORAGE MODE: No more version checks that wipe data.
        // We only seed data if the specialized keys are completely missing.

        // Check if projects exist
        if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
            console.log('Initialize: Seeding Projects...');
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(MOCK_PROJETS));
        }

        // Check if appointments exist
        if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
            console.log('Initialize: Seeding Appointments...');
            localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(MOCK_RENDEZVOUS));
        }

        // Check if notifications exist
        if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
        }

        // Users are special: we might want to sync them or keep them.
        // For now, if missing, we just let the app handle it (AuthContext usually has the hardcoded ones).
        // But if we want to persist changes to users (like avatars), we should initialize it.
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            // We don't seed users here to avoid overriding AuthContext's logic, 
            // but if we did, we'd use MOCK_USERS if we had them here.
        }
    },

    // PROJETS
    getProjects(): ProjetPFE[] {
        const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        return data ? JSON.parse(data) : [];
    },

    syncStudentProfile(studentId: string, updates: { nom?: string; avatar?: string }) {
        const projects = this.getProjects();
        const index = projects.findIndex(p => p.idEtudiant === studentId);
        if (index !== -1) {
            if (updates.nom) projects[index].nomEtudiant = updates.nom;
            if (updates.avatar) projects[index].avatarEtudiant = updates.avatar;
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

    // USERS (Persisted in storage for lifecycle across logins)
    getUsers(): any[] {
        const data = localStorage.getItem(STORAGE_KEYS.USERS);
        return data ? JSON.parse(data) : [];
    },

    saveUsers(users: any[]) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },

    updateUser(updatedUser: any) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
        } else {
            users.push(updatedUser);
        }
        this.saveUsers(users);
    },

    // RENDEZ-VOUS
    getAppointments(): RendezVous[] {
        const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
        const apps: RendezVous[] = data ? JSON.parse(data) : [];

        // Ensure avatars are present by linking with project data if missing
        const projects = this.getProjects();
        return apps.map(app => {
            if (!app.avatarEtudiant) {
                const project = projects.find(p => p.idEtudiant === app.idEtudiant);
                if (project?.avatarEtudiant) {
                    return { ...app, avatarEtudiant: project.avatarEtudiant };
                }
            }
            return app;
        });
    },

    addAppointment(appointment: RendezVous) {
        const apps = this.getAppointments();
        const projects = this.getProjects();
        const project = projects.find(p => p.idEtudiant === appointment.idEtudiant);

        apps.push({
            ...appointment,
            avatarEtudiant: project?.avatarEtudiant
        });
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
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notes.slice(0, 15))); // Augmenté à 15 pour l'historique
    },

    clearNotifications() {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    },

    deactivateNotification(id: string) {
        const notes = this.getNotifications();
        const index = notes.findIndex(n => n.id === id);
        if (index !== -1) {
            notes[index].actif = false;
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notes));
        }
    },

    deleteNotification(id: string) {
        const notes = this.getNotifications();
        const updated = notes.filter(n => n.id !== id);
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    },

    hasNotification(idEtudiant: string, message: string): boolean {
        const notes = this.getNotifications();
        return notes.some(n => n.idEtudiant === idEtudiant && n.message === message);
    },

    checkAndGenerateRDVReminders(studentId: string, schedule: any[]) {
        const today = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(today.getDate() + 3);

        // Actually, better to pass the fiche or projectId

        schedule.forEach(rdv => {
            const rdvDate = new Date(rdv.weekOf);
            if (rdvDate > today && rdvDate <= threeDaysFromNow) {
                const message = `RAPPEL : Votre RDV N°${rdv.numero} est prévu pour la semaine du ${new Date(rdv.weekOf).toLocaleDateString()}. Pensez à préparer votre travail.`;
                if (!this.hasNotification(studentId, message)) {
                    this.addNotification({
                        id: `rem-rdv-${rdv.numero}-${Date.now()}`,
                        type: 'info',
                        message,
                        date: new Date().toISOString(),
                        idEtudiant: studentId
                    });
                }
            }
        });
    },

    // GESTION DES DOCUMENTS
    addDocumentToProject(projectId: string, document: { name: string; url: string; type: 'rapport' | 'presentation' | 'annexe' | 'article' | 'autre' }) {
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
    },

    // BACKUP & RESTORE
    exportData() {
        const data = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            storage: {
                projects: localStorage.getItem(STORAGE_KEYS.PROJECTS),
                appointments: localStorage.getItem(STORAGE_KEYS.APPOINTMENTS),
                notifications: localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
                fiches: localStorage.getItem(STORAGE_KEYS.FICHES),
                // We typically don't export users if they are auth-managed, but simple backup:
                // users: localStorage.getItem(STORAGE_KEYS.USERS) 
            }
        };
        return JSON.stringify(data, null, 2);
    },

    importData(jsonString: string): boolean {
        try {
            const data = JSON.parse(jsonString);
            if (!data.storage) return false;

            if (data.storage.projects) localStorage.setItem(STORAGE_KEYS.PROJECTS, data.storage.projects);
            if (data.storage.appointments) localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, data.storage.appointments);
            if (data.storage.notifications) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, data.storage.notifications);
            if (data.storage.fiches) localStorage.setItem(STORAGE_KEYS.FICHES, data.storage.fiches);

            return true;
        } catch (e) {
            console.error('Import failed', e);
            return false;
        }
    }
};
