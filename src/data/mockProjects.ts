import type { ProjetPFE, RendezVous } from '../types';

export const MOCK_PROJETS: ProjetPFE[] = [
    {
        id: 'proj-1',
        titre: 'Étude du comportement des bétons fibrés à haute performance',
        idEtudiant: 'std-1',
        nomEtudiant: 'Ahmed Ben Salem',
        nomEncadrant: 'Prof. Mohamed Dhouibi',
        description: 'Analyse des propriétés mécaniques du BFHP sous sollicitations dynamiques.',
        statut: 'en-cours',
        progres: {
            experimental: [
                { id: 'exp-1', label: 'Caractérisation des matériaux', progres: 100, derniereMiseAJour: '2024-01-15', dateLimite: '2024-01-20' },
                { id: 'exp-2', label: 'Coulage des éprouvettes', progres: 80, derniereMiseAJour: '2024-01-20', dateLimite: '2024-02-15' },
                { id: 'exp-3', label: 'Essais de compression', progres: 20, derniereMiseAJour: '2024-01-28', dateLimite: '2024-03-01' },
            ],
            redaction: [
                { id: 'red-1', label: 'Revue bibliographique', progres: 90, derniereMiseAJour: '2024-01-10', dateLimite: '2024-03-15' },
                { id: 'red-2', label: 'Partie expérimentale', progres: 40, derniereMiseAJour: '2024-01-25', dateLimite: '2024-04-10' },
                { id: 'red-3', label: 'Analyse des résultats', progres: 0, derniereMiseAJour: '2024-01-28', dateLimite: '2024-05-01' },
            ]
        },
        urlFichePFE: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        journalSuivi: [
            { date: '15/01/2024', heure: '09:30', commentaire: 'Matériaux prêts pour les tests.', type: 'etudiant' },
            { date: '20/01/2024', heure: '14:15', commentaire: 'Début du coulage.', type: 'etudiant' },
            { date: '22/01/2024', heure: '11:00', commentaire: 'Bon avancement du coulage. Attention à la cure.', type: 'superviseur' }
        ]
    },
    {
        id: 'proj-2',
        titre: 'Dimensionnement sismique des structures en zone instable',
        idEtudiant: 'std-2',
        nomEtudiant: 'Leila Toumi',
        nomEncadrant: 'Prof. Mohamed Dhouibi',
        description: 'Calcul des fondations sur sols liquéfiables.',
        statut: 'attente-validation',
        progres: {
            experimental: [
                { id: 'exp-1', label: 'Sondages in-situ', progres: 100, derniereMiseAJour: '2024-01-10', dateLimite: '2024-01-15' },
                { id: 'exp-2', label: 'Modélisation numérique', progres: 100, derniereMiseAJour: '2024-01-22', dateLimite: '2024-02-10' },
                { id: 'exp-3', label: 'Analyse spectrale', progres: 90, derniereMiseAJour: '2024-01-29', dateLimite: '2024-03-01' },
            ],
            redaction: [
                { id: 'red-1', label: 'Revue bibliographique', progres: 100, derniereMiseAJour: '2024-01-15', dateLimite: '2024-02-15' },
                { id: 'red-2', label: 'Partie calculs', progres: 100, derniereMiseAJour: '2024-01-25', dateLimite: '2024-04-15' },
                { id: 'red-3', label: 'Conclusion', progres: 50, derniereMiseAJour: '2024-02-01', dateLimite: '2024-06-01' },
            ]
        },
        urlFichePFE: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        journalSuivi: [
            { date: '25/01/2024', heure: '10:00', commentaire: 'Modélisation SAP2000 terminée.', type: 'etudiant' },
            { date: '01/02/2024', heure: '16:00', commentaire: 'Résultats validés. Passez à la rédaction finale.', type: 'superviseur' }
        ]
    }
];

export const MOCK_RENDEZVOUS: RendezVous[] = [
    {
        id: 'rdv-1',
        idEtudiant: 'std-1',
        nomEtudiant: 'Ahmed Ben Salem',
        idProjet: 'proj-1',
        titreProjet: 'Étude du comportement des bétons fibrés à haute performance',
        date: '2024-02-05',
        creneauHoraire: '09:00 - 10:00',
        motif: 'Révision des résultats expérimentaux',
        statut: 'en-attente'
    }
];
