import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

import {logUserOut ,auth} from '../firebase.js'
import { onAuthStateChanged, getAuth } from 'firebase/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      onAuthStateChanged(auth, (firebaseUser) => {
        if(firebaseUser){
          setUser({...firebaseUser,role: "admin"});
        } else {setUser(null) }
        setLoading(false)
});
    },[]);

  const login = async (username, password) => {
    const session = await authService.login(username, password);
    setUser(session);
    return session;
  };

  const logout = async () => {
    await logUserOut()
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
