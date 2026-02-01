import type { ProjetPFE, RendezVous } from '../types';

export const MOCK_PROJETS: ProjetPFE[] = [
    {
        id: 'proj-1',
        titre: 'Valorisation des déchets de bouteilles de plastique (PET) comme Granulats partiels dans la formulation des bétons légers',
        idEtudiant: 'std-1',
        nomEtudiant: 'Hmaidi Mohamed',
        nomEncadrant: 'Dr. Oussama Atoui',
        description: 'Étude de l\'incorporation de granulats PET recyclés pour l\'allègement des structures en béton.',
        statut: 'en-cours',
        progres: {
            experimental: [
                { id: 'exp-1', label: 'Caractérisation PET', progres: 0 },
                { id: 'exp-2', label: 'Formulation bétons légers', progres: 0 },
                { id: 'exp-3', label: 'Essais de compression/traction', progres: 0 },
            ],
            redaction: [
                { id: 'red-1', label: 'Revue bibliographique (Plastiques)', progres: 0 },
                { id: 'red-2', label: 'Synthèse bibliographique', progres: 0 },
                { id: 'red-3', label: 'Analyse des résultats', progres: 0 },
            ]
        },
        urlFichePFE: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        journalSuivi: []
    },
    {
        id: 'proj-2',
        titre: 'Développement d\'un Béton Auto-Compactant Incorporant des Déchets de Pneus Recyclés pour Applications Non-Structurelles',
        idEtudiant: 'std-2',
        nomEtudiant: 'Melki Wael',
        nomEncadrant: 'Dr. Oussama Atoui',
        description: 'Étude de l\'incorporation de granulats de pneus recyclés dans un béton auto-compactant (BAP).',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Caractérisation pneus', progres: 0 }, { id: 'exp-2', label: 'Formulation BAP', progres: 0 }, { id: 'exp-3', label: 'Tests rhéologiques', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Revue bibliographique (Pneus/BAP)', progres: 0 }, { id: 'red-2', label: 'Méthodologie', progres: 0 }, { id: 'red-3', label: 'Analyse', progres: 0 }]
        },
        urlFichePFE: '',
        journalSuivi: []
    },
    {
        id: 'proj-3',
        titre: 'Amélioration des propriétés thermiques et mécaniques de briques en terre crue par l\'incorporation de fibres végétales locales',
        idEtudiant: 'std-3',
        nomEtudiant: 'Oueslati Ghofrane',
        nomEncadrant: 'Dr. Oussama Atoui',
        description: 'Étude de l\'amélioration des caractéristiques des briques de terre crue via des fibres locales (thèrmique et mécanique).',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Sélection fibres', progres: 0 }, { id: 'exp-2', label: 'Pressage briques', progres: 0 }, { id: 'exp-3', label: 'Tests conductivité', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Revue bibliographique (Terre/Fibres)', progres: 0 }, { id: 'red-2', label: 'Analyse thermique', progres: 0 }, { id: 'red-3', label: 'Conclusion', progres: 0 }]
        },
        urlFichePFE: '',
        journalSuivi: []
    },
    {
        id: 'proj-4',
        titre: 'Étude Comparative de l’Efficacité de Différents Additifs Naturels (Cactus, Blanc d’Œuf) comme Stabilisants pour Mortiers de Terre',
        idEtudiant: 'std-4',
        nomEtudiant: 'Fedi Karmi',
        nomEncadrant: 'Dr. Oussama Atoui',
        description: 'Comparaison de l\'impact du cactus et du blanc d\'œuf sur la stabilisation et la performance des mortiers de terre.',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Préparation additifs', progres: 0 }, { id: 'exp-2', label: 'Confection éprouvettes', progres: 0 }, { id: 'exp-3', label: 'Essais de durabilité', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Revue bibliographique (Stabilisants)', progres: 0 }, { id: 'red-2', label: 'Protocole expérimental', progres: 0 }, { id: 'red-3', label: 'Analyse comparative', progres: 0 }]
        },
        urlFichePFE: '',
        journalSuivi: []
    },
    {
        id: 'proj-5',
        titre: 'Sujet PFE - En attente d\'affectation',
        idEtudiant: 'std-5',
        nomEtudiant: 'En attente...',
        nomEncadrant: 'Dr. Oussama Atoui',
        description: 'Poste vacant pour futur étudiant.',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Tâche 1', progres: 0 }, { id: 'exp-2', label: 'Tâche 2', progres: 0 }, { id: 'exp-3', label: 'Tâche 3', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Rédaction 1', progres: 0 }, { id: 'red-2', label: 'Rédaction 2', progres: 0 }, { id: 'red-3', label: 'Rédaction 3', progres: 0 }]
        },
        urlFichePFE: '',
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
