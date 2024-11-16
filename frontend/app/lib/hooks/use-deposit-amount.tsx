export const useDepositAmount = (address: string | undefined) => {
  if (!address) {
    return false;
  }
  console.log("useDepositAmount", address);
  return true;
};
