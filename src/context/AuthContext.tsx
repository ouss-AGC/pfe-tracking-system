import { createContext, useContext, useState, ReactNode } from 'react';
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
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=atoui'
};

const MOCK_STUDENTS: Utilisateur[] = [
    {
        id: 'std-1',
        nom: 'Ahmed Ben Salem',
        email: 'ahmed.bs@student.tn',
        role: 'student',
        motDePasse: PASSWORD_DEFAULT,
        numeroMatricule: '2023-GC-001',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed'
    },
    {
        id: 'std-2',
        nom: 'Leila Toumi',
        email: 'leila.t@student.tn',
        role: 'student',
        motDePasse: PASSWORD_DEFAULT,
        numeroMatricule: '2023-GC-002',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leila'
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

        // Optionnel: Mettre à jour MOCK_STUDENTS en mémoire pour la session actuelle si nécessaire
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
