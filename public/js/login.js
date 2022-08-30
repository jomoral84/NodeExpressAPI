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
            showAlert('success', 'Usuario correcto!');
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

        if ((res.data.status === 'success')) location.reload(true);

    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error al deslogearse');
    }
}