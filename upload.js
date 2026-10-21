const { handleUpload } = require("@vercel/blob/client");

// Yahan apna password likho (ya Vercel mein ADMIN_PASSWORD set karo)
const PASSWORD = process.env.ADMIN_PASSWORD || "180509";
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const json = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (clientPayload !== PASSWORD) {
          throw new Error("Galat password");
        }
        return {
          allowedContentTypes: ["video/mp4", "video/webm", "image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 5 * 1024 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    res.status(200).json(json);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
