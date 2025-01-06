let messages = []; // 留言存储在内存中

export default function handler(req, res) {
  // 设置跨域头
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 处理 OPTIONS 预检请求
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    // 返回所有留言
    return res.status(200).json(messages);
  } else if (req.method === "POST") {
    // 添加新留言
    const { content, userId } = req.body;
    if (!content || !userId) {
      return res.status(400).json({ error: "留言内容和用户ID不能为空" });
    }
    const newMessage = { id: Date.now(), content, userId, timestamp: new Date() }; // 关联用户ID
    messages.push(newMessage);
    return res.status(201).json(newMessage);
  } else if (req.method === "DELETE") {
    // 删除留言
    const { id, userId } = req.body; // 获取留言ID和用户ID
    const message = messages.find((msg) => msg.id === id);

    if (!message) {
      return res.status(404).json({ error: "留言不存在" });
    }
    if (message.userId !== userId) {
      return res.status(403).json({ error: "无权限删除该留言" });
    }

    messages = messages.filter((msg) => msg.id !== id); // 删除留言
    return res.status(200).json({ success: true });
  } else {
    return res.status(405).json({ error: "不支持的方法" });
  }
}
