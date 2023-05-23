export const truncateString = (str: string, limit: number = 40): string => {
  if (!str) return "N/A";
  if (str.length < limit) return str;
  return `${str.slice(0, 10)}...${str.slice(-10)}`;
};

export function validateIpfsHash(hash: string): boolean {
  const legacyRegex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  const cidRegex = /^bafy[a-zA-Z0-9]{46}$/;
  return legacyRegex.test(hash) || cidRegex.test(hash);
}
