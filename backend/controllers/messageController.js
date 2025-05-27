const Message = require('../models/message');

exports.sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { conversationId, text, image, sticker } = req.body;

  try {
    const message = await Message.create({
      conversationId,
      sender: senderId,
      text,
      image,
      sticker
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessagesByConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId })
      .populate('sender', 'firstName lastName avatar');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
