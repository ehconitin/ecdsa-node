const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.secp256k1.utils.randomPrivateKey();

console.log("private key: ", toHex(privateKey));

const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log("Public key: ", toHex(publicKey));

const address = getAddress(publicKey);
console.log("address: ", toHex(address));

function getAddress(publicKey) {
  const sliced = publicKey.slice(1, publicKey.length);
  const hashed = keccak256(sliced);
  return hashed.slice(hashed.length - 20, hashed.length);
}
