/* eslint-disable */

import axios from "axios";
import { showAlert } from "./alerts";


export const bookTour = async(tourId) => {

    const stripe = Stripe('pk_test_51LZcf0EbdxPYBJYMZfhmhxNJ2TkQMiUTMPXFAB4qcblxupFfsBC6bWQnmiT8eXMBCOHWbZ4ELYavsjNfnjJ1NPM900YwowhIDk'); // API Test Key de Stripe

    try {
        // 1) Get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

        // 2) Crea checkout form

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })

        //   window.location.replace(session.data.session.url);

    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};