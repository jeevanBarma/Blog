const express = require("express");
const mongoose = require("mongoose");
const Blog = mongoose.model("Blog");
const User = mongoose.model("User");
const authRequire = require("../Middleware/authRequire");
const router = express.Router();

router.use(authRequire);

router.get("/", async (req, res) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (error) {
    console.log(error);
  }
  if (!blogs) {
    return res.status(404).send({ error: "No Blogs Found" });
  }
  return res.status(200).send({ blogs });
});

router.get("/my-blogs", async (req, res) => {
  const email = req.email;
  const user = await User.findOne({ email });
  const id = new mongoose.Types.ObjectId(user._id);
  //const cleanedObjectId = id.replace(/^new ObjectId\("(.*)"\)$/, "$1");
  console.log(id);
  let blogsById;
  try {
    blogsById = await Blog.find({ author: "64c6059c7e7e118304de0036" });
  } catch (error) {
    console.log(error);
  }
  if (!blogsById) {
    return res.status(404).send({ error: "No Blogs Found" });
  }
  return res.status(200).send({ blogsById });
});

router.post("/blog", async (req, res) => {
  const { title, description, image, author } = req.body;
  const blog = new Blog({
    title,
    description,
    image,
    author,
    likes: [],
    comments: [],
  });

  try {
    await blog.save();
  } catch (error) {
    res.status(400).send({ error: "Unable to add Blog" });
  }

  res.status(200).send({ blog });
});

router.put("/blog/:id", async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;
  let updatedblog;
  try {
    updatedblog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );
  } catch (error) {
    res.status(400).send({ error: "Error updating the Blog" });
  }
  if (!updatedblog) {
    return res.status(400).send({ error: "Unable to update the blog" });
  }
  return res.status(200).send({ updatedblog });
});

router.delete("/blog/:id", async (req, res) => {
  let id = req.params.id;
  try {
    const deletedBlog = await Blog.findByIdAndRemove(id);
    if (!deletedBlog) {
      return res.status(400).send({ error: "Unable to delete Blog" });
    }
    return res.status(200).send({ message: "Successfully Deteled Blog" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting the blog" });
  }
});

module.exports = router;
