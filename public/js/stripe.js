/* eslint-disable */

import axios from "axios";
import { showAlert } from "./alerts";


export const bookTour = async(tourId) => {

    try {
        // 1) 
        const stripe = Stripe('pk_test_51LZcf0EbdxPYBJYMZfhmhxNJ2TkQMiUTMPXFAB4qcblxupFfsBC6bWQnmiT8eXMBCOHWbZ4ELYavsjNfnjJ1NPM900YwowhIDk'); // API Test Key de Stripe

        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        console.log(session);

        // 2) Crea checkout form

        // await stripe.redirectToCheckout({
        //     sessionId: session.data.session.id
        // })

        window.location.replace(session.data.session.url);

    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};