const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

/* User 1:
private key:  577215846f3df85a5416a7c8473bc41b6a36b75a06ed77716e27da86e66f7651
Public key:  033979bc140337672f69ea3652671897777df6450c9f905c582b17c44c9c86380f
address:  8f69a09b9c8a77ffe730602bf2ec6fb2ceaf09b6
User 2:
private key:  92229724778b1b26e2da6158501853c4901d75d42eaa391ecc21f9a6c991a3d3
Public key:  0299f10990107552b2e4560618341cf48200bcd2b77fb29a82b12e2fc206906518
address:  67cac68a1b00404624f3cfe79bd74ec87b25622c
User 3:
private key:  5af790ef9cd14900971c56586e93d97d96c90e20f5ae2b6709209e3b177e22a1
Public key:  026991f686f5f8b9d50fdc390cef7edd61f1fd15c37baa462f1f77ec5a893c2eb7
address:  fbb0a8dbd69cd30747b90dd50ca173d1f328326c */

const balances = {
  "033979bc140337672f69ea3652671897777df6450c9f905c582b17c44c9c86380f": 100,
  "0299f10990107552b2e4560618341cf48200bcd2b77fb29a82b12e2fc206906518": 50,
  "026991f686f5f8b9d50fdc390cef7edd61f1fd15c37baa462f1f77ec5a893c2eb7": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  const message = `from: ${sender}, to:${recipient}, amount:${amount}`;
  const hashMsg = hashMessage(message);
  const signatureParsed = parseSignature(signature);

  const isSigned = secp.secp256k1.verify(signatureParsed, hashMsg, sender);

  if (isSigned) {
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "invalid signature" });
  }
});

app.post("/sign", async (req, res) => {
  const { sender, recipient, amount, privateKey } = req.body;
  setInitialBalance(sender);
  setInitialBalance(recipient);
  const message = `from: ${sender}, to:${recipient}, amount:${amount}`;

  const signature = await signMessage(message, privateKey);
  console.log(signature);
  const signatureStringyfied = stringifySignature(signature);
  console.log(signatureStringyfied);
  res.send({ signatureStringyfied });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

async function signMessage(msg, privateKey) {
  const messageHash = hashMessage(msg);

  const signature = await secp.secp256k1.sign(messageHash, privateKey);

  return signature;
}

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}

function stringifySignature(signature) {
  return `Signature { r: ${signature.r}, s: ${signature.s}, recovery: ${signature.recovery} }`;
}

function parseSignature(serializedSignature) {
  const regex = /Signature { r: (\d+), s: (\d+), recovery: (\d+) }/;
  const match = serializedSignature.match(regex);

  if (!match) {
    throw new Error("Invalid serialized signature format");
  }

  const r = BigInt(match[1]);
  const s = BigInt(match[2]);
  const recovery = parseInt(match[3]);

  return { r, s, recovery };
}
