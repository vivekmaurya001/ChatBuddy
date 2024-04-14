const asyncHandler = require("express-async-handler");
const Chat = require("../Models/ChatModel");
const User = require("../Models/User");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(req.user._id);
  if (!userId) {
    console.log("UserId params not send with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
    } catch (error) {
      res.json(error.message);
    }
  }
});

//for group only admins can do but for one to one any can do
const DeleteChat = asyncHandler(async (req, res) => {
  const { ChatId } = req.body;

  const removed = await Chat.findByIdAndDelete({ _id: ChatId });

  if (!removed) {
    res.status(404).json("Chat Not Found");
  } else {
    res.json(removed);
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.json(error.message);
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 are required to form a group chat");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.json(error.message);
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404), json("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

//for group only
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404), json("Chat Not Found");
  } else {
    res.json(added);
  }
});

//for group only
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404), json("Chat Not Found");
  } else {
    res.json(removed);
  }
});
module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  DeleteChat,
  removeFromGroup,
};
