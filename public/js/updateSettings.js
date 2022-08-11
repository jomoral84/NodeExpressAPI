/* eslint-disable */


import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async(data, type) => { // type puede ser password o data

    try {

        const url =
            type === 'password' ?
            'http://localhost:3000/api/v1/users/updateMyPassword' :
            'http://localhost:3000/api/v1/users/updateMe';

        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            console.log('datos modificados!')
            showAlert('success', `${type.toUpperCase()} modificados!`);
            window.setTimeout(() => {
                location.reload(); // Recarga la pagina para que la foto se actualize en el momento
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}