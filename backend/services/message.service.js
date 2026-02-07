import { saveMessage } from "../models/messages.model.js";

export const saveMessageService = async (
  phoneNumber,
  messageText,
  status,
  responseId
) => {

  const savedMessage = await saveMessage(
    phoneNumber,
    messageText,
    status,
    responseId
  );

  return savedMessage;
};
