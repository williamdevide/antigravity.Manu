import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  loginAs: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  isAdmin: boolean;
  isTecnico: boolean;
  isSolicitante: boolean;
}

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  gestor: {
    uid: 'gestor_joao',
    nome: 'João Paulo Ferreira',
    email: 'joao.ferreira@sp.senai.br',
    nif: '11234',
    role: 'gestor',
    setor: 'Coordenação de Manutenção Predial',
  },
  tecnico: {
    uid: 'tec_roberto',
    nome: 'Roberto Silveira',
    email: 'roberto.silveira@sp.senai.br',
    nif: '33412',
    role: 'tecnico',
    setor: 'Oficina de Manutenção Elétrica / Hidráulica',
  },
  solicitante: {
    uid: 'prof_carlos',
    nome: 'Prof. Carlos Eduardo Santos',
    email: 'carlos.santos@sp.senai.br',
    nif: '48912',
    role: 'solicitante',
    setor: 'Docência - Mecânica & Usinagem CNC',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sigmanu_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_USERS.gestor;
  });

  useEffect(() => {
    localStorage.setItem('sigmanu_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    setCurrentUser(DEFAULT_USERS[role]);
  };

  const loginAs = (profile: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...profile,
    }));
  };

  const logout = () => {
    setCurrentUser(DEFAULT_USERS.solicitante);
  };

  const isAdmin = currentUser.role === 'gestor';
  const isTecnico = currentUser.role === 'tecnico' || currentUser.role === 'gestor';
  const isSolicitante = currentUser.role === 'solicitante';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        switchRole,
        loginAs,
        logout,
        isAdmin,
        isTecnico,
        isSolicitante,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};

