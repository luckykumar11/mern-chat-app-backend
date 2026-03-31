const express = require("express");
const {
  allMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  getUnreadMessages,
  markChatMessagesAsRead,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/unread").get(protect, getUnreadMessages);
router.route("/read/:chatId").put(protect, markChatMessagesAsRead);
router.route("/:chatId").get(protect, allMessages);
router.route("/:messageId").put(protect, editMessage).delete(protect, deleteMessage);

module.exports = router;
