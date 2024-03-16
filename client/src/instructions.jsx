import React from "react";

const Instructions = () => {
  return (
    <div className="">
      <h1>Instructions to follow : </h1>

      <ul>
        <li>
          Enter public key in <b>wallet address</b> to get balance
        </li>
        <li>
          Enter amount to send in <b>Send Amount</b>
        </li>
        <li>
          Enter recipients public key in <b>Recipient</b>
        </li>
        <li>
          Before initiating transfer <b>Create signature</b> by entering{" "}
          <b>Private key</b>
        </li>
        <li>
          You can now see signature on screen. Initiate <b>Transfer</b>, if the
          private key used for signature is valid and is verfied the amount will
          get transfered
        </li>
      </ul>
    </div>
  );
};

export default Instructions;
