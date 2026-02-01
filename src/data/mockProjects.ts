import type { ProjetPFE, RendezVous } from '../types';

export const MOCK_PROJETS: ProjetPFE[] = [
    {
        id: 'proj-1',
        titre: 'Étude du comportement des bétons fibrés à haute performance',
        idEtudiant: 'std-1',
        nomEtudiant: 'Ahmed Ben Salem',
        nomEncadrant: 'Dr. Oussama Atoui',
        description: 'Analyse des propriétés mécaniques du BFHP.',
        statut: 'en-cours',
        progres: {
            experimental: [
                { id: 'exp-1', label: 'Caractérisation', progres: 100, derniereMiseAJour: '2024-01-15' },
                { id: 'exp-2', label: 'Coulage', progres: 80, derniereMiseAJour: '2024-01-20' },
                { id: 'exp-3', label: 'Essais', progres: 20, derniereMiseAJour: '2024-01-28' },
            ],
            redaction: [
                { id: 'red-1', label: 'Revue bibliographique', progres: 90, derniereMiseAJour: '2024-01-10' },
                { id: 'red-2', label: 'Partie expérimentale', progres: 40, derniereMiseAJour: '2024-01-25' },
                { id: 'red-3', label: 'Analyse', progres: 0, derniereMiseAJour: '2024-01-28' },
            ]
        },
        urlFichePFE: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        journalSuivi: []
    },
    {
        id: 'proj-2',
        titre: 'Dimensionnement sismique des structures en zone instable',
        idEtudiant: 'std-2',
        nomEtudiant: 'Leila Toumi',
        nomEncadrant: 'Dr. Oussama Atoui',
        description: 'Calcul des fondations sur sols liquéfiables.',
        statut: 'attente-validation',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Sondages', progres: 100 }, { id: 'exp-2', label: 'Modélisation', progres: 100 }, { id: 'exp-3', label: 'Analyse', progres: 90 }],
            redaction: [{ id: 'red-1', label: 'Biblio', progres: 100 }, { id: 'red-2', label: 'Calculs', progres: 100 }, { id: 'red-3', label: 'Conclusion', progres: 50 }]
        },
        urlFichePFE: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        journalSuivi: []
    },
    {
        id: 'proj-3',
        titre: 'Analyse de la vulnérabilité des ponts en béton armé',
        idEtudiant: 'std-3',
        nomEtudiant: 'Hamdi Mansour',
        nomEncadrant: 'Dr. Oussama Atoui',
        description: 'Étude de la dégradation par corrosion.',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Inspections', progres: 100 }, { id: 'exp-2', label: 'Tests chlore', progres: 50 }, { id: 'exp-3', label: 'Mesures', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Biblio', progres: 100 }, { id: 'red-2', label: 'Diagnostic', progres: 20 }, { id: 'red-3', label: 'Réparations', progres: 0 }]
        },
        urlFichePFE: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        journalSuivi: []
    },
    {
        id: 'proj-4',
        titre: 'Valorisation des déchets de construction dans le béton',
        idEtudiant: 'std-4',
        nomEtudiant: 'Sonia Ghariani',
        nomEncadrant: 'Dr. Oussama Atoui',
        description: 'Recyclage des agrégats pour un béton écologique.',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Tri granulats', progres: 100 }, { id: 'exp-2', label: 'Mélanges', progres: 10 }, { id: 'exp-3', label: 'Écrasement', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Biblio', progres: 80 }, { id: 'red-2', label: 'Méthodologie', progres: 0 }, { id: 'red-3', label: 'Résultats', progres: 0 }]
        },
        urlFichePFE: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        journalSuivi: []
    },
    {
        id: 'proj-5',
        titre: 'Optimisation des structures métalliques par algorithmes',
        idEtudiant: 'std-5',
        nomEtudiant: 'Youssef Briki',
        nomEncadrant: 'Dr. Oussama Atoui',
        description: 'Réduction de poids des hangars aéronautiques.',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Scripting', progres: 60 }, { id: 'exp-2', label: 'Tests', progres: 0 }, { id: 'exp-3', label: 'Calcul final', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Biblio', progres: 40 }, { id: 'red-2', label: 'Algorithmes', progres: 0 }, { id: 'red-3', label: 'Vérification', progres: 0 }]
        },
        urlFichePFE: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        journalSuivi: []
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
