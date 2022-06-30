import { NextApiHandler } from "next";

const handler: NextApiHandler<string> = async (req, res) => {
  const { token, id } = req.query;

  if (!token || token !== process.env.PREVIEW_TOKEN) {
    return res.status(401).end("Invalid token");
  }

  res.setPreviewData({});

  res.writeHead(307, { Location: `/blog/post/${id}` });
  res.end();
};

export default handler;
