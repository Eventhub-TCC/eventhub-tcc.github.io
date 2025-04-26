import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import api from '../axios';

const ProtectedRoute = () => {
    const [ autenticado, setAutenticado ] = useState<null | boolean>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAutenticado(false);
            return;
        }
        (async () => {
            try{
                await api.get('/users/authenticate')
                setAutenticado(true);
            }
            catch(erro){
                localStorage.removeItem('token');
                setAutenticado(false);
            }
        })();
    }, []);

    if (autenticado === null) {
        return; 
    }

    return autenticado ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;