import React, { useState } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { useSelector } from "react-redux";

const PayPalBtn = ( { amount, onSuccess, currency } ) => {
  const { user } = useSelector((state) => state.auth);
  console.log(user.paypalId);
  return (
    <PayPalButton
      amount={amount}
      currency={currency}
      onSuccess={(details, data) => onSuccess(details, data)}
      options={{
        clientId:
          user.paypalId ||
          "AcQmp0g49rhE_ZVizX5a6pSPdHYnFrC-Bck3eXtZjYyCZELhi8ETi0Zdnmq7pMg7xlhHB_CbS0poRmxq",
      }}
    />
  );
};
export default PayPalBtn;
