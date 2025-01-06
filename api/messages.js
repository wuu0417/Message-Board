import { createClient } from "@vercel/edge-config";

const edgeConfig = createClient({
  token: "375e55d2-d626-40bb-8b28-ce7447b87b7c", // 替换为你的 Edge Config Token
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const messages = (await edgeConfig.get("messages")) || [];

    if (req.method === "GET") {
      return res.status(200).json(messages);
    }

    if (req.method === "POST") {
      const { username, content } = req.body;

      if (!username || !content) {
        return res.status(400).json({ error: "用户名和内容不能为空" });
      }

      const newMessage = { id: Date.now(), username, content };
      messages.push(newMessage);
      await edgeConfig.set("messages", messages);

      return res.status(201).json(newMessage);
    }

    if (req.method === "DELETE") {
      const { id, username } = req.body;

      const index = messages.findIndex(
        (msg) => msg.id === id && msg.username === username
      );
      if (index === -1) {
        return res.status(404).json({ error: "留言不存在或无权限删除" });
      }

      messages.splice(index, 1);
      await edgeConfig.set("messages", messages);

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "不支持的方法" });
  } catch (error) {
    console.error("服务器错误:", error);
    return res.status(500).json({ error: "服务器错误" });
  }
}
