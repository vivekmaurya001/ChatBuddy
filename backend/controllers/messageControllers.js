const asyncHandler = require("express-async-handler");
const Message = require("../Models/MessageModel");
const User = require("../Models/User");
const Chat = require("../Models/ChatModel");
const cloudinary = require("../Cloudinary");

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, image } = req.body;

  let Url;
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: "messageImage",
    });
    Url = result.url;
    console.log(result);
  }

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    Chat: chatId,
  };

  if (image) {
    newMessage.image = Url;
  }
  console.log(newMessage);
  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("Chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ Chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("Chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = { sendMessage, allMessages };
