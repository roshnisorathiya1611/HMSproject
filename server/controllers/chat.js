import Chats from "../models/Chat.js";

// It is not a controlers this funciton will be called by socket
const sendMessage = async (senderId, receiverId, message, isFile = false) => {
  let combinedId = "";
  if (senderId > receiverId) {
    combinedId = senderId + receiverId;
  } else {
    combinedId = receiverId + senderId;
  }

  let newChat = new Chats({
    sender: senderId,
    receiver: receiverId,
    message: message,
    combinedId: combinedId,
    file: isFile,
  });

  await (await newChat.save()).populate("sender receiver");

  return newChat;
};

// contorller
const fetchAllMessages = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user._id;
  let combinedId = "";
  if (senderId > receiverId) {
    combinedId = senderId + receiverId;
  } else {
    combinedId = receiverId + senderId;
  }

  let messages = await Chats.find({ combinedId: combinedId }).populate(
    "sender receiver"
  );
  return res.status(200).json({ success: true, messages });
};

export { sendMessage, fetchAllMessages };
