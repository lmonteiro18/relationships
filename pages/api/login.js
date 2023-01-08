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

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (user !== null) {
      console.log("User:", user);

      bcrypt.compare(password, user.password, function (err, result) {
        if (!err) {
          if (result === true) {
            res.status(200).json({ success: true, user: user.username });
          } else {
            res.status(404).json({
              message: "Incorrect username and/or password.",
            });
          }
        } else {
          console.log("Error:", err);
          res.status(404).json({ error: err });
        }
      });
    } else {
      res.status(404).json({
        message: "Incorrect username and/or password.",
      });
    }
  } catch (err) {
    console.log("Error:", err);
    res.status(404).json({ error: err });
  }
}
