import { useReducer, useEffect } from "react";
import { createContext } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const initialState = {
        token: null,
    };

    const authReducer = (state, action) => {
        switch (action.type) {
            case 'LOGIN':
                return { ...state, token: action.payload.token };
            case 'LOGOUT':
                return { ...state, token: null };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(authReducer, initialState)

    useEffect(() => {
        const checkToken = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                dispatch({ type: 'LOGIN', payload: { token: storedToken } });
            }
        };
        checkToken();
    }, []);

    const login = async (token) => {
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN', payload: { token } });
    };

    const logout = async () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };
    return (
        <AuthContext.Provider value = {{...state, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}