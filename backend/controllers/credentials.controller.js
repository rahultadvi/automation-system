import { createCredentialsService } from "../services/credentials.service.js";

export const saveCredentialsController = async (req, res) => {

  try {
    const { token, phoneId, accountId } = req.body;

    const data = await createCredentialsService(token, phoneId, accountId);

    res.status(201).json({
      message: "Credentials saved successfully",
      data
    });

  } catch (error) {
    res.status(500).json({
      message: "Error saving credentials",
      error: error.message
    });
  }

};
