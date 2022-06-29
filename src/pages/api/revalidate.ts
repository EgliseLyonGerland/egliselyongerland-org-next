import { NextApiHandler } from "next";

interface Post {
  ID: number;
}

const isProduction = process.env.NODE_ENV === "production";

const handler: NextApiHandler<string> = async (req, res) => {
  const { token } = req.query;

  if (isProduction && (!token || token !== process.env.REVALIDATE_TOKEN)) {
    return res.status(401).send("Error: Invalid token");
  }

  let path = "";

  switch (req.headers["x-wp-webhook-name"]) {
    case "post_update":
    case "post_create":
    case "post_delete":
      const post = req.body.post as Post;

      path = `/blog/post/${post.ID}`;
      break;
  }

  if (!path) {
    return res.status(401).send("Error: Invalid path");
  }

  try {
    await res.unstable_revalidate(path);
    return res.send("OK");
  } catch (err) {
    return res.status(500).send("Error");
  }
};

export default handler;
