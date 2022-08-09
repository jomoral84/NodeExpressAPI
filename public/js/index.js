/* eslint-disable */

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';


const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');


if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}


if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);

    });
}


if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        updateSettings({ name, email }, 'data');

    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();

        const passwordCurrent = document.getElementById('passwordCurrent').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;


        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

        document.getElementById('passwordCurrent').value = '';
        document.getElementById('password').value = '';
        document.getElementById('passwordConfirm').value = '';

    });
}