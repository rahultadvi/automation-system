import { saveMessage } from "../models/messages.model.js";


export const saveMessageService = async (
  userId,
  phoneNumber,
  messageText,
  status,
  responseId
) => {

  const savedMessage = await saveMessage(
    userId,
    phoneNumber,
    messageText,
    status,
    responseId
  );

  return savedMessage;
};
// export const saveMessageService = async (
//   userId,
//   phoneNumber,
//   messageText,
//   status,
//   responseId
// ) => {

//   const savedMessage = await saveMessage(
//     userId,
//     phoneNumber,
//     messageText,
//     status,
//     responseId
//   );

//   return savedMessage;
// };
