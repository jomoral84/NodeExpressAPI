/* eslint-disable */

// Alertas en el logeo de usuario


export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) {
        el.parentElement.removeChild(el);
    }

}

export const showAlert = (type, msg) => { // type is success or error
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg} </>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 3000);
}