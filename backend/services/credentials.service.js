import { saveCredentials } from "../models/credentials.model.js";

export const createCredentialsService = async (token, phoneId, accountId) => {

  const savedData = await saveCredentials(token, phoneId, accountId);

  return savedData;
};
