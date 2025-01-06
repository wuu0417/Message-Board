let messages = []; // 内存存储（仅用于示例，生产环境可用数据库）

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(messages); // 返回所有留言
  } else if (req.method === "POST") {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "留言内容不能为空" });
    }
    messages.push({ content, timestamp: new Date() });
    res.status(201).json({ success: true });
  } else {
    res.status(405).json({ error: "不支持的方法" });
  }
}
