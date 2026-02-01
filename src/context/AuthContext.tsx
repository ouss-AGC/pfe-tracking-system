import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { storageService } from '../services/storageService';
import type { Utilisateur, EtatAuth, Role } from '../types';

interface AuthContextType extends EtatAuth {
    login: (email: string, password: string, role: Role) => Promise<void>;
    logout: () => void;
    updateProfile: (updatedUser: Partial<Utilisateur>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users
const PASSWORD_DEFAULT = 'PFE2026';

const MOCK_SUPERVISOR: Utilisateur = {
    id: 'sup-1',
    nom: 'Dr. Oussama Atoui',
    email: '08530118', // Identifiant spécifique
    role: 'supervisor',
    motDePasse: '0331', // Code PIN fourni
    avatar: '/dr-atoui.jpg'
};

const MOCK_STUDENTS: Utilisateur[] = [
    {
        id: 'std-1',
        nom: 'Hmaidi Mohamed',
        email: 'mohamedhmaidi922@gmail.com',
        telephone: '22524322',
        role: 'student',
        motDePasse: PASSWORD_DEFAULT,
        avatar: '/students/hmaidi-mohamed.png'
    },
    {
        id: 'std-2',
        nom: 'Melki Wael',
        email: 'melkiwael36@gmail.com',
        telephone: '99230369',
        role: 'student',
        motDePasse: PASSWORD_DEFAULT,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wael'
    },
    {
        id: 'std-3',
        nom: 'Oueslati Ghofrane',
        email: 'fechbej@gmail.com',
        telephone: '56601931',
        role: 'student',
        motDePasse: PASSWORD_DEFAULT,
        avatar: '/students/ghofrane-oueslati.png'
    },
    {
        id: 'std-4',
        nom: 'Fedi Karmi',
        email: 'karmifedi@gmail.com',
        telephone: '53277762',
        role: 'student',
        motDePasse: PASSWORD_DEFAULT,
        avatar: '/students/fedi-karmi.png'
    },
    {
        id: 'std-5',
        nom: 'Mohamed Aziz Elayed',
        email: 'mouahmedaziza12@gmail.com',
        telephone: '23881847',
        role: 'student',
        motDePasse: PASSWORD_DEFAULT,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aziz'
    }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<EtatAuth>(() => {
        const saved = localStorage.getItem('pfe_auth');
        return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
    });

    const login = async (email: string, password: string, role: Role) => {
        let foundUser: Utilisateur | undefined;

        if (role === 'supervisor' && email === MOCK_SUPERVISOR.email) {
            foundUser = MOCK_SUPERVISOR;
        } else {
            foundUser = MOCK_STUDENTS.find(s => s.email === email);
        }

        if (foundUser && foundUser.motDePasse === password) {
            const newState = { user: foundUser, isAuthenticated: true };
            setState(newState);
            localStorage.setItem('pfe_auth', JSON.stringify(newState));
        } else {
            throw new Error('Identifiants ou mot de passe invalides');
        }
    };

    const logout = () => {
        setState({ user: null, isAuthenticated: false });
        localStorage.removeItem('pfe_auth');
    };

    const updateProfile = (updatedUser: Partial<Utilisateur>) => {
        if (!state.user) return;
        const newUser = { ...state.user, ...updatedUser };
        const newState = { ...state, user: newUser };
        setState(newState);
        localStorage.setItem('pfe_auth', JSON.stringify(newState));

        // Synchroniser avec le projet si c'est un étudiant et que le nom a changé
        if (newUser.role === 'student' && updatedUser.nom) {
            storageService.syncStudentName(newUser.id, updatedUser.nom);
        }

        // Optionnel: Mettre à jour MOCK_STUDENTS en mémoire
        const studentIdx = MOCK_STUDENTS.findIndex(s => s.id === newUser.id);
        if (studentIdx !== -1) {
            MOCK_STUDENTS[studentIdx] = newUser as Utilisateur;
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
