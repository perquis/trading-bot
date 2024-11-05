export const throwMissingEnvironmentVariable = (variable: string): never => {
  console.error(`Missing environment variable: ${variable}`);
  process.exit(1);
};
