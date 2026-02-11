export type Role = 'supervisor' | 'student';

export interface Utilisateur {
    id: string;
    nom: string;
    email: string;
    role: Role;
    motDePasse?: string; // Mot de passe pour l'accès sécurisé
    avatar?: string;
    numeroMatricule?: string;
    telephone?: string;
}

export interface JalonProgres {
    id: string;
    label: string;
    progres: number; // 0-100
    derniereMiseAJour?: string;
    dateLimite?: string; // Nouvelle deadline
}

export interface ProgresProjet {
    experimental: JalonProgres[];
    redaction: JalonProgres[];
}

export interface EntreeJournal {
    date: string;
    heure: string; // Nouveau: Heure précise pour preuve administrative
    commentaire: string;
    type: 'etudiant' | 'superviseur';
}

export interface DocumentPFE {
    id: string;
    name: string;
    url: string;
    date: string;
    type: 'rapport' | 'presentation' | 'annexe' | 'article' | 'autre';
}

export interface ProjetPFE {
    id: string;
    titre: string;
    idEtudiant: string;
    nomEtudiant: string;
    emailEtudiant: string; // Nouveau: Pour communication directe
    avatarEtudiant?: string; // Photo de l'étudiant
    telephoneEtudiant?: string; // GSM de l'étudiant
    nomEncadrant: string;
    emailEncadrant: string; // Nouveau: Pour communication directe étudiant -> encadrant
    description: string;
    urlFicheProposition?: string;
    progres: ProgresProjet;
    statut: 'en-cours' | 'attente-validation' | 'signe' | 'termine';
    signatureEncadrant?: string;
    cachetEncadrant?: string;
    dateSignature?: string;
    signatureChefDepartement?: string;
    cachetChefDepartement?: string;
    dateSignatureChef?: string;
    urlFichePFE?: string; // Lien vers le document de référence
    journalSuivi: EntreeJournal[]; // Nouveau: Preuve de suivi hebdomadaire
    documents?: DocumentPFE[]; // Nouveau: Documents uploadés
    scientificPaperStatus?: 'not-started' | 'draft' | 'submitted' | 'validated'; // Requirement for Visa
}

export type StatutRendezVous = 'en-attente' | 'accepte' | 'reporte' | 'annule';

export interface RendezVous {
    id: string;
    idEtudiant: string;
    nomEtudiant: string;
    avatarEtudiant?: string; // Photo for supervisor recognition
    idProjet: string;
    titreProjet: string;
    date: string;
    creneauHoraire: string;
    motif: string;
    statut: StatutRendezVous;
    notes?: string;
}

export interface NotificationGlobale {
    id: string;
    message: string;
    date: string;
    auteur: string;
    type: 'info' | 'alerte' | 'urgent';
    actif: boolean;
}

export interface EtatAuth {
    user: Utilisateur | null;
    isAuthenticated: boolean;
}

// ============ FICHE SUIVI PFE (ENQ-REF-32) ============

export interface StudentRDVInput {
    travailRealise: string;
    difficultes: string;
    signature: boolean;
    signatureDate?: string;
    signatureData?: string; // Base64 image data
}

export interface SupervisorRDVInput {
    avisAvancement: 'excellent' | 'satisfaisant' | 'insuffisant' | '';
    remarksText?: string;
    etapeSuivante: string;
    signature: boolean;
    signatureDate?: string;
    stampApplied: boolean;
}

export interface RendezVousFiche {
    numero: number; // 1-6
    weekOf: string; // ISO date "2026-02-09"
    status: 'pending' | 'in-progress' | 'completed' | 'missed';
    studentInput: StudentRDVInput;
    supervisorInput: SupervisorRDVInput;
    visaDirecteur: boolean;
    directorSignature?: boolean;
    directorStamp?: boolean;
}

export interface EvaluationFinale {
    evaluationTravail: 'excellent' | 'bien' | 'moyen' | 'insuffisant' | '';
    evaluationRapport: 'excellent' | 'bien' | 'moyen' | 'insuffisant' | '';
    avisSoutenabilite: 'favorable' | 'reserve' | 'defavorable' | '';
    date?: string;
    supervisorSignature: boolean;
    supervisorStamp: boolean;
}

export interface FicheSuiviPFEData {
    id: string;
    projectId: string;
    studentId: string;
    studentName: string;
    supervisorName: string;
    projectTitle: string;
    pfeNumber: string;
    year: string; // "2025-2026"

    rendezVous: RendezVousFiche[];
    evaluationFinale: EvaluationFinale;

    deadlineRapport: string; // "2026-06-01"
    dateSoutenance: string; // "2026-06-08"

    createdAt: string;
    updatedAt: string;
    scientificPaperRequirementMet?: boolean; // Visa Condition
}

// RDV Schedule for 2026
export const RDV_SCHEDULE_2026 = [
    { numero: 1, weekOf: '2026-02-09', label: 'Semaine du 09/02/2026' },
    { numero: 2, weekOf: '2026-03-02', label: 'Semaine du 02/03/2026' },
    { numero: 3, weekOf: '2026-03-23', label: 'Semaine du 23/03/2026' },
    { numero: 4, weekOf: '2026-04-06', label: 'Semaine du 06/04/2026' },
    { numero: 5, weekOf: '2026-04-27', label: 'Semaine du 27/04/2026' },
    { numero: 6, weekOf: '2026-05-11', label: 'Semaine du 11/05/2026' },
];
