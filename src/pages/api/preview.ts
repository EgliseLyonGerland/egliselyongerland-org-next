import { NextApiHandler } from "next";

const handler: NextApiHandler<string> = async (req, res) => {
  const { token, id, path } = req.query;

  if (!token || token !== process.env.PREVIEW_TOKEN) {
    return res.status(401).end("Invalid token");
  }
  if (typeof path !== "string") {
    return res.status(401).end("Invalid path");
  }

  res.setPreviewData({ id });
  res.redirect(path);
};

export default handler;
