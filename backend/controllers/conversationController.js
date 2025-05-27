const Conversation = require('../models/conversation');

exports.createConversation = async (req, res) => {
  const { userId } = req.user;
  const { receiverId } = req.body;

  try {
    const existing = await Conversation.findOne({
      members: { $all: [userId, receiverId] }
    });

    if (existing) return res.json(existing);

    const newConvo = await Conversation.create({
      members: [userId, receiverId]
    });

    res.status(201).json(newConvo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    const conversations = await Conversation.find({ members: userId }).populate('members', 'firstName lastName avatar');
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
