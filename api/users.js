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
    const users = (await edgeConfig.get("users")) || [];

    if (req.method === "POST") {
      const { username, nickname, type } = req.body;

      if (!username) {
        return res.status(400).json({ error: "用户名不能为空" });
      }

      if (type === "register") {
        if (users.some((user) => user.username === username)) {
          return res.status(400).json({ error: "用户名已存在" });
        }
        if (!nickname) {
          return res.status(400).json({ error: "昵称不能为空" });
        }
        users.push({ username, nickname });
        await edgeConfig.set("users", users);
        return res.status(201).json({ success: true, nickname });
      } else if (type === "login") {
        const user = users.find((user) => user.username === username);
        if (!user) {
          return res.status(404).json({ error: "用户名不存在" });
        }
        return res.status(200).json({ success: true, nickname: user.nickname });
      } else {
        return res.status(400).json({ error: "无效的请求类型" });
      }
    } else {
      return res.status(405).json({ error: "不支持的方法" });
    }
  } catch (error) {
    console.error("服务器错误:", error);
    return res.status(500).json({ error: "服务器错误" });
  }
}
