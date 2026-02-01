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

export interface ProjetPFE {
    id: string;
    titre: string;
    idEtudiant: string;
    nomEtudiant: string;
    emailEtudiant: string; // Nouveau: Pour communication directe
    avatarEtudiant?: string; // Photo de l'étudiant
    telephoneEtudiant?: string; // GSM de l'étudiant
    nomEncadrant: string;
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
}

export type StatutRendezVous = 'en-attente' | 'accepte' | 'reporte' | 'annule';

export interface RendezVous {
    id: string;
    idEtudiant: string;
    nomEtudiant: string;
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
