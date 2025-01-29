/**
 * Gets an environment variable with production safety check
 * @param key - The environment variable key
 * @param defaultValue - Optional default value for non-production environments
 * @throws {Error} If the environment variable is not set in production
 */
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  
  if (!value) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`${key} must be set in production`);
    }
    if (defaultValue === undefined) {
      throw new Error(`${key} is not set and no default value provided`);
    }
    return defaultValue;
  }
  
  return value;
};
