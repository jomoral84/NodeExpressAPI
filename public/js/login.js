/* eslint-disable */


const login = async(email, password) => {


    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            alert('Usuario correcto!');
            window.setTimeout(() => {
                location.assign('/'); // Una vez logeado envia al usuario a la homepage
            }, 1500);
        }

    } catch (err) {
        console.log(err);
    }
};



document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);

});