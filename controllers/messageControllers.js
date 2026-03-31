const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, attachment } = req.body;

  if ((!content && !attachment) || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content || "",
    chat: chatId,
    readBy: [req.user._id],
  };

  if (attachment) {
    newMessage.attachment = attachment;
  }

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Get unread messages for logged in user
//@route           GET /api/Message/unread
//@access          Protected
const getUnreadMessages = asyncHandler(async (req, res) => {
  try {
    const userChats = await Chat.find({ users: req.user._id }).select("_id");
    const chatIds = userChats.map((chat) => chat._id);

    const unreadMessages = await Message.find({
      chat: { $in: chatIds },
      sender: { $ne: req.user._id },
      readBy: { $ne: req.user._id },
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name pic email")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "name pic email",
        },
      });

    res.json(unreadMessages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Mark all unread messages in a chat as read
//@route           PUT /api/Message/read/:chatId
//@access          Protected
const markChatMessagesAsRead = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const result = await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id },
      },
      {
        $addToSet: { readBy: req.user._id },
      }
    );

    res.json({
      message: "Messages marked as read",
      modifiedCount: result.modifiedCount || result.nModified || 0,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Edit Message
//@route           PUT /api/Message/:messageId
//@access          Protected
const editMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only edit your own messages");
    }

    message.content = content;
    message.isEdited = true;
    const updatedMessage = await message.save();

    await updatedMessage.populate("sender", "name pic").execPopulate();
    await updatedMessage.populate("chat").execPopulate();
    const finalMessage = await User.populate(updatedMessage, {
      path: "chat.users",
      select: "name pic email",
    });

    res.json(finalMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Delete Message
//@route           DELETE /api/Message/:messageId
//@access          Protected
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only delete your own messages");
    }

    await Message.findByIdAndDelete(messageId);

    // Provide the deleted messageId so frontend can remove it from state easily
    res.json({ message: "Message deleted successfully", messageId });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  allMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  getUnreadMessages,
  markChatMessagesAsRead,
};
