import type { ProjetPFE, RendezVous } from '../types';

export const MOCK_PROJETS: ProjetPFE[] = [
    {
        id: 'proj-2',
        titre: 'Développement d\'un Béton Auto-Compactant Incorporant des Déchets de Pneus Recyclés pour Applications Non-Structurelles',
        idEtudiant: 'std-2',
        nomEtudiant: 'Wael Melki',
        emailEtudiant: 'melkiwael36@gmail.com',
        avatarEtudiant: '/students/melki-wael.png',
        telephoneEtudiant: '99230369',
        nomEncadrant: 'Dr. Oussama Atoui',
        emailEncadrant: 'oussmer@hotmail.fr',
        description: 'Étude de l\'incorporation de granulats de pneus recyclés dans un béton auto-compactant (BAP).',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Caractérisation pneus', progres: 0 }, { id: 'exp-2', label: 'Formulation BAP', progres: 0 }, { id: 'exp-3', label: 'Tests rhéologiques', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Revue bibliographique (Pneus/BAP)', progres: 0 }, { id: 'red-2', label: 'Méthodologie', progres: 0 }, { id: 'red-3', label: 'Analyse', progres: 0 }]
        },
        urlFichePFE: '/proposals/fiche-wael-melki.pdf',
        journalSuivi: []
    },
    {
        id: 'proj-3',
        titre: 'Amélioration des propriétés thermiques et mécaniques de briques en terre crue par l\'incorporation de fibres végétales locales',
        idEtudiant: 'std-3',
        nomEtudiant: 'Ghofrane Oueslati',
        emailEtudiant: 'fechbej@gmail.com',
        avatarEtudiant: '/students/ghofrane-oueslati.png',
        telephoneEtudiant: '56601931',
        nomEncadrant: 'Dr. Oussama Atoui',
        emailEncadrant: 'oussmer@hotmail.fr',
        description: 'Étude de l\'amélioration des caractéristiques des briques de terre crue via des fibres locales (thèrmique et mécanique).',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Sélection fibres', progres: 0 }, { id: 'exp-2', label: 'Pressage briques', progres: 0 }, { id: 'exp-3', label: 'Tests conductivité', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Revue bibliographique (Terre/Fibres)', progres: 0 }, { id: 'red-2', label: 'Analyse thermique', progres: 0 }, { id: 'red-3', label: 'Conclusion', progres: 0 }]
        },
        urlFichePFE: 'https://pdfobject.com/pdf/sample.pdf',
        journalSuivi: []
    },
    {
        id: 'proj-4',
        titre: 'Étude Comparative de l\'Efficacité de Différents Additifs Naturels (Cactus, Blanc d\'Œuf) comme Stabilisants pour Mortiers de Terre',
        idEtudiant: 'std-4',
        nomEtudiant: 'Fedi Karmi',
        emailEtudiant: 'karmifedi@gmail.com',
        avatarEtudiant: '/students/fedi-karmi.png',
        telephoneEtudiant: '53277762',
        nomEncadrant: 'Dr. Oussama Atoui',
        emailEncadrant: 'oussmer@hotmail.fr',
        description: 'Comparaison de l\'impact du cactus et du blanc d\'œuf sur la stabilisation et la performance des mortiers de terre.',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Préparation additifs', progres: 0 }, { id: 'exp-2', label: 'Confection éprouvettes', progres: 0 }, { id: 'exp-3', label: 'Essais de durabilité', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Revue bibliographique (Stabilisants)', progres: 0 }, { id: 'red-2', label: 'Protocole expérimental', progres: 0 }, { id: 'red-3', label: 'Analyse comparative', progres: 0 }]
        },
        urlFichePFE: 'https://pdfobject.com/pdf/sample.pdf',
        journalSuivi: []
    },
    {
        id: 'proj-5',
        titre: 'Étude de l\'Incorporation de Coquilles de Mollusques Concassées comme Substitution au Sable dans les Mortiers de Ciment',
        idEtudiant: 'std-5',
        nomEtudiant: 'Mohamed Aziz Elayed',
        emailEtudiant: 'mouahmedaziza12@gmail.com',
        avatarEtudiant: '/students/mohamed-aziz-elayed.png',
        telephoneEtudiant: '23881847',
        nomEncadrant: 'Dr. Oussama Atoui',
        emailEncadrant: 'oussmer@hotmail.fr',
        description: 'Évaluation des performances mécaniques et de durabilité des mortiers incorporant des déchets de mollusques.',
        statut: 'en-cours',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Traitement coquilles', progres: 0 }, { id: 'exp-2', label: 'Formulation mortiers', progres: 0 }, { id: 'exp-3', label: 'Essais de flexion', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'État de l\'art', progres: 0 }, { id: 'red-2', label: 'Analyse des résultats', progres: 0 }, { id: 'red-3', label: 'Perspectives', progres: 0 }]
        },
        urlFichePFE: '/proposals/fiche-mohamed-aziz.pdf',
        journalSuivi: []
    },
    {
        id: 'proj-6',
        titre: 'Valorisation des déchets de bouteilles de plastique (PET) comme Granulats partiels dans la formulation des bétons légers',
        idEtudiant: 'std-6',
        nomEtudiant: 'Hmaidi Mohamed',
        emailEtudiant: 'mohamedhmaidi922@gmail.com',
        avatarEtudiant: '/students/hmaidi-mohamed.png',
        telephoneEtudiant: '22524322',
        nomEncadrant: 'Dr. Oussama Atoui',
        emailEncadrant: 'oussmer@hotmail.fr',
        description: 'Étude de la valorisation des déchets plastiques PET comme substitut partiel des granulats dans la formulation de bétons légers.',
        statut: 'attente-validation',
        progres: {
            experimental: [{ id: 'exp-1', label: 'Préparation granulats PET', progres: 0 }, { id: 'exp-2', label: 'Formulation bétons', progres: 0 }, { id: 'exp-3', label: 'Tests mécaniques', progres: 0 }],
            redaction: [{ id: 'red-1', label: 'Revue bibliographique (PET/Bétons)', progres: 0 }, { id: 'red-2', label: 'Méthodologie expérimentale', progres: 0 }, { id: 'red-3', label: 'Analyse environnementale', progres: 0 }]
        },
        urlFichePFE: '/proposals/fiche-pfe.pdf',
        journalSuivi: []
    }
];

export const MOCK_RENDEZVOUS: RendezVous[] = [
    {
        id: 'rdv-1',
        idEtudiant: 'std-5',
        nomEtudiant: 'Mohamed Aziz Elayed',
        avatarEtudiant: '/students/mohamed-aziz-elayed.png',
        idProjet: 'proj-5',
        titreProjet: 'Étude de l\'Incorporation de Coquilles de Mollusques Concassées comme Substitution au Sable dans les Mortiers de Ciment',
        date: '2026-02-10',
        creneauHoraire: '09:00 - 10:00',
        motif: 'Discussion sur le traitement des coquilles',
        statut: 'en-attente'
    }
];
