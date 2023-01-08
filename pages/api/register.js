const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
import connectMongoose from "../../utils/connectMongoose";
import User from "../../models/userModel";

/**
 * @param {import('next).NextApiRequest} req
 * @param {import('next).NextApiResponse} res
 */

const saltRounds = 12;

export default async function handler(req, res) {
  await connectMongoose();

  //const { username, password } = req.body;

  try {
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
      if (!err) {
        const users = await User.find({ username: req.body.username });

        console.log("Users:", users);

        if (users.length === 0) {
          const user = new User({
            username: req.body.username,
            password: hash,
          });

          console.log("User:", user);

          try {
            const newUser = await user.save();
            res.status(200).json({ success: true });
          } catch (err) {
            console.log("Error:", err);
            res.status(404).json({ error: err });
          }
        } else {
          res
            .status(404)
            .json({ message: "There's already a user with that username." });
        }
      } else {
        console.log("Error:", err);
        res.status(404).json({ error: err });
      }
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(404).json({ error: err });
  }
}
