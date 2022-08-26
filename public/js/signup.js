/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async(name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Usuario creado!');
            window.setTimeout(() => {
                location.assign('/me'); // Una vez creado envia al usuario a su cuenta
            }, 1500);
        }

    } catch (err) {
        showAlert('error', err.response.data.message);

    }
};