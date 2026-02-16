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

const MOCK_SUPERVISOR: Utilisateur = {
    id: 'sup-1',
    nom: 'Dr. Oussama Atoui',
    email: '08530118', // Identifiant spécifique
    role: 'supervisor',
    motDePasse: '0331', // Code PIN fourni
    avatar: '/dr-atoui.jpg'
};

export const MOCK_STUDENTS: Utilisateur[] = [
    {
        id: 'std-6',
        nom: 'Hmaidi Mohamed',
        email: 'mohamedhmaidi922@gmail.com',
        telephone: '22524322',
        role: 'student',
        motDePasse: '842917',
        avatar: '/students/hmaidi-mohamed.png'
    },
    {
        id: 'std-2',
        nom: 'Melki Wael',
        email: 'melkiwael36@gmail.com',
        telephone: '99230369',
        role: 'student',
        motDePasse: '395164',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wael'
    },
    {
        id: 'std-3',
        nom: 'Oueslati Ghofrane',
        email: 'fechbej@gmail.com',
        telephone: '56601931',
        role: 'student',
        motDePasse: '271828',
        avatar: '/students/ghofrane-oueslati.png'
    },
    {
        id: 'std-4',
        nom: 'Fedi Karmi',
        email: 'karmifedi@gmail.com',
        telephone: '53277762',
        role: 'student',
        motDePasse: '618034',
        avatar: '/students/fedi-karmi.png'
    },
    {
        id: 'std-5',
        nom: 'Mohamed Aziz Elayed',
        email: 'mouhamedaziza12@gmail.com',
        telephone: '23881847',
        role: 'student',
        motDePasse: '502847',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aziz'
    }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<EtatAuth>(() => {
        // Initialiser les utilisateurs dans le storage s'ils n'existent pas
        if (storageService.getUsers().length === 0) {
            storageService.saveUsers([MOCK_SUPERVISOR, ...MOCK_STUDENTS]);
        }

        const saved = localStorage.getItem('pfe_auth');
        return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
    });

    const login = async (email: string, password: string, role: Role) => {
        const allUsers = storageService.getUsers();
        let foundUser: Utilisateur | undefined;

        if (role === 'supervisor' && email === MOCK_SUPERVISOR.email) {
            foundUser = allUsers.find(u => u.id === MOCK_SUPERVISOR.id);
        } else {
            foundUser = allUsers.find(s => s.email === email && s.role === 'student');
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

        // Synchroniser avec le storage (persiste après déconnexion)
        storageService.updateUser(newUser);

        // Synchroniser avec le projet si c'est un étudiant
        if (newUser.role === 'student') {
            storageService.syncStudentProfile(newUser.id, {
                nom: updatedUser.nom,
                avatar: updatedUser.avatar
            });
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
