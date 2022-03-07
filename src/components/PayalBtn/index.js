import React, { useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";

const PayPalBtn = ( { amount, onSuccess, currency, paypalId } ) => {
  return (
    <PayPalButton
      amount={amount}
      currency={currency}
      onSuccess={(details, data) => onSuccess(details, data)}
      options={{
        clientId: paypalId ? paypalId : "AbB5uClbyGGBMog5UVj8VUuQjTxX6G_c9QIODaCQqX76kCqk9X0cajhQVuJRZrYb5f9Gh-jxe8VFq3D9",
      }}
    />
  );
};
export default PayPalBtn;
