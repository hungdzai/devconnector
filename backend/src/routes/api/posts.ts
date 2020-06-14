const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator/check")
const uuid = require("uuid")
import requireAuth from "../../middleware/requireAuth"
const User = require("../../models/User")
import UserAccess from "../../dataLayer/userAccess"

import Post from "../../models/Post"
import PostAccess from "../../dataLayer/postAccess"

const userAccess = new UserAccess()
const postAccess = new PostAccess()
// @route   POST api/posts/test
// desc     Create a post
// @access  Private
router.post(
  "/",
  [requireAuth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() })
    }
    try {
      const user = await userAccess.getUserById(req.user.id)
      const newPost = {
        id: uuid.v4(),
        date: new Date().toISOString(),
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        likes: [],
        comments: [],
      }
      await postAccess.createPost(newPost)
      res.json(newPost)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)

// @route   GET api/posts
// desc     Get all posts
// @access  Private
router.get("/", requireAuth, async (req, res) => {
  try {
    const posts = await postAccess.getPosts()
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/posts/:id
// desc     Get post by ID
// @access  Private
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const post = await postAccess.getPostById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: "Post not found" })
    }
    res.json(post)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
// @route   DELETE api/posts/:id
// desc     Delete a post
// @access  Private
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const post = await postAccess.getPostById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: "Post not found" })
    }
    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }
    const { user, date } = post
    await postAccess.deletePost(user, date)
    res.json({ msg: "Post removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      //catch invalid objectid
      return res.status(404).json({ msg: "Post not found" })
    }
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/posts/like/:id
// desc     Like a post
// @access  Private
router.put("/like/:id", requireAuth, async (req, res) => {
  try {
    const post = await postAccess.getPostById(req.params.id)
    // Check if the post has already been liked
    if (!post.likes) {
      post.likes = [{ user: req.user.id }]
    } else {
      if (
        post.likes.filter((like) => like.user.toString() === req.user.id)
          .length > 0
      ) {
        return res.status(400).json({ msg: "Post already liked" })
      }
      post.likes.unshift({ user: req.user.id })
    }
    await postAccess.createPost(post)
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   PUT api/posts/unlike/:id
// desc     Unlike a post
// @access  Private
router.put("/unlike/:id", requireAuth, async (req, res) => {
  try {
    const post = await postAccess.getPostById(req.params.id)
    // Check if the post has already been liked
    if (
      !post.likes ||
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post hasn't been liked" })
    }
    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)
    post.likes.splice(removeIndex, 1)
    await postAccess.createPost(post)
    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   POST api/posts/comment/:id
// desc     Create a comment
// @access  Private
router.post(
  "/comment/:id",
  [requireAuth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() })
    }
    try {
      const user = await userAccess.getUserById(req.user.id)
      const post = await postAccess.getPostById(req.params.id)
      const newComment = {
        id: uuid.v4(),
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
        date: new Date().toISOString(),
      }
      if (!post.comments) {
        post.comments = [newComment]
      } else post.comments.unshift(newComment)
      await postAccess.createPost(post)
      res.json(post.comments)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
// @route   DELETE api/posts/comment/:id/:comment_id
// desc     Delete a comment
// @access  Private
router.delete("/comment/:id/:comment_id", requireAuth, async (req, res) => {
  try {
    const post = await postAccess.getPostById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: "Post not found" })
    }
    // Find comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    )
    // Check comment
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" })
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }
    // Get remove index
    const removeIndex = post.comments.indexOf(comment)
    post.comments.splice(removeIndex, 1)
    await postAccess.createPost(post)
    res.json({ msg: "Post removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
module.exports = router
