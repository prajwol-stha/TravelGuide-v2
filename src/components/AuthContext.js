import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAccessToken, removeAccessToken, setAccessToken } from '../componentsSaurav/modules/handleAccessToken';
import LoadingScreen from '../componentsSaurav/screens/LoadingScreen';
import { getLanguage, setLanguage } from '../componentsSaurav/modules/handleLanguage';
import { useTranslation } from 'react-i18next';


const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [lang, setLang] = useState('en')
    const { i18n } = useTranslation()

    useEffect(() => {
        async function checkAccessToken() {
            const accessToken = await getAccessToken()
            if (accessToken) {
                setIsLoggedIn(true)
            }
            setLoading(false)
        }
        checkAccessToken();
    }, [])

    const login = async (accessToken) => {
        await setAccessToken(accessToken)
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await removeAccessToken(null)
        setIsLoggedIn(false);
    };


    useEffect(() => {
        async function loadLanguage() {
            const lang = await getLanguage()
            if (lang) {
                i18n.changeLanguage(lang)
            }
        }
        loadLanguage();
    }, [lang])


    async function changeLanguage(language) {
        if (language) {
            await setLanguage(language)
            setLang(language)
        }
    }
    async function getCurrentLanguage() {
        const current = await getLanguage();
        return current
    }

    if (loading) {
        // Display loading indicator or screen until the authentication status is determined
        return <LoadingScreen />;
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, changeLanguage, getCurrentLanguage }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
