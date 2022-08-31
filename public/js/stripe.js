/* eslint-disable */

import axios from "axios";
import { showAlert } from "./alerts";


export const bookTour = async(tourId) => {

    const stripe = Stripe('pk_test_51LZcf0EbdxPYBJYMS4T42HbpkKbnLhNovOQmpP7nDYpoA7tL36sMiYr5T37PflJSAgJ7RIxkDjjlN7JorKCBPYOr00dlQsZmdq'); // API Test Key de Stripe

    try {
        // 1) Get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

        // 2) Crea checkout form

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};