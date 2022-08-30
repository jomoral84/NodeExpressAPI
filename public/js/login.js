/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async(email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Bienvenido!');
            window.setTimeout(() => {
                location.assign('/'); // Una vez logeado envia al usuario a la homepage
            }, 1500);
        }

    } catch (err) {
        showAlert('Hubo un error!', err.response.data.message);
    }
};



export const logout = async() => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });


        if (res.data.status === 'success') {
            location.assign('/');
        }

    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error al deslogearse');
    }
}



export const signup = async(name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm,
            },
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Registro Exitoso!');
            window.setImmediate(() => {
                location.assign('/me');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};