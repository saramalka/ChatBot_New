const ChatNode = require('../models/ChatNode');

const getChatNodes=async (req, res) => {
    const chatNodes = await ChatNode.find();
    res.json(chatNodes);
  }

const createChatNode=async (req, res) => {
    const chatNode = req.body;
    const newChatNode=await ChatNode.create(chatNode)
    if(!newChatNode)
        return res.status(400).send('faild to create chatNode')
    res.status(201).json(newChatNode);
  }
  
  const updateChatNode = async (req, res) => {
    const { id } = req.params
    const { text } = req.body
  
    const chatNode = await ChatNode.findById(id);
    if (!chatNode) {
      return res.status(400).send('ChatNode not found');
    }
  
    chatNode.text = text
    const updated = await chatNode.save()
  
    res.json(updated)
  };
  

const deleteChatNode= async (req, res) => {
    const { id } = req.params;
    const deletedUser=await ChatNode.findByIdAndDelete(id);
    if(!deletedUser)
        return res.status(400).send('failed to delete chatNode')
    res.json({ message: 'Deleted successfully' });
  }
  
module.exports={deleteChatNode,getChatNodes,createChatNode,updateChatNode}  