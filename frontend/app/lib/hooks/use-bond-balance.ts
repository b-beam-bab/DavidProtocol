export const useBondBalance = (address: string | undefined) => {
  if (!address) {
    return false;
  }
  console.log("useBondBalance", address);
  return true;
};
