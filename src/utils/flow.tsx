export function prepFlowInputs(inputs: any, wallet: any) {
  const walletPk = wallet.publicKey.toBase58();
  const jsonStr = JSON.stringify(inputs).replace(/WALLET/g, walletPk);
  return JSON.parse(jsonStr);
}
