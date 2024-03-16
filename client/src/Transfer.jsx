import { useState } from "react";
import server from "./server";
import Signature from "./signature";

function Transfer({ address, setBalance, setSignature, signature }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  async function createSignature(evt) {
    evt.preventDefault();
    try {
      const {
        data: { signatureStringyfied },
      } = await server.post(`sign`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        privateKey,
      });
      setSignature(signatureStringyfied);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }
  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <div>
        <label>
          Private key
          <input
            placeholder="enter private key"
            onChange={setValue(setPrivateKey)}
          ></input>
        </label>
        <input
          className="button"
          value="Create signature"
          onClick={createSignature}
        />
      </div>

      <input
        type="submit"
        className={`button ${!signature ? "inactive" : ""}`}
        value="Transfer"
        disabled={!signature}
      />
    </form>
  );
}

export default Transfer;
