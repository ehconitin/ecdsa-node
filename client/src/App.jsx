import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import Signature from "./signature";
import Instructions from "./instructions";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");

  return (
    <div>
      <div className="app">
        <Wallet
          balance={balance}
          setBalance={setBalance}
          address={address}
          setAddress={setAddress}
        />
        <Transfer
          setBalance={setBalance}
          address={address}
          signature={signature}
          setSignature={setSignature}
        />
      </div>
      <div>
        <Signature signature={signature} />
      </div>
      <div>
        <Instructions />
      </div>
    </div>
  );
}

export default App;
