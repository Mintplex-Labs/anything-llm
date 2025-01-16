process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

const { makeJWT, userFromSession } = require("../utils/http");
const { User } = require("../models/user");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { ROLES } = require("../utils/middleware/multiUserProtected");
const crypto = require("crypto");
const { Workspace } = require("../models/workspace");
const { KeycloakHelper } = require("../utils/keycloak");

function authEndpoints(app) {
  if (!app) return;

  app.get("/auth", async (req, res) => {
    const authUrl = KeycloakHelper.getAuthRedirectUrl();
    res.redirect(authUrl);
  });

  app.get("/auth/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
      return res.status(400).send("No code found");
    }
    try {
      const userInfo = await KeycloakHelper.getUserInfoByCode(code);
      let existingUser = await User._get({
        username: String(userInfo?.user?.username),
      });

      if (!existingUser || !existingUser?.uid) {
        if (!existingUser) {
          await User.create({
            username: userInfo?.user?.username,
            password: crypto.randomUUID(),
            role: ROLES.default,
            uid: userInfo?.sub,
          });
        } else {
          await User.update(existingUser?.id, { uid: userInfo?.sub });
        }
        existingUser = await User._get({
          username: String(userInfo.user.username),
        });
        Workspace.new(userInfo.user.username + "-workspace", existingUser.id);
      }
      const fullAuthResponse = {
        valid: true,
        user: User.filterFields(existingUser),
        token: makeJWT(
          {
            id: existingUser.id,
            username: existingUser.username,
            uid: userInfo?.sub,
          },
          "30d"
        ),
        message: null,
      };
      const cookieConfig = {
        maxAge: 900000,
        httpOnly: false,
        secure: false,
      };
      res.cookie("token", fullAuthResponse.token, cookieConfig);
      res.cookie(
        "user",
        JSON.stringify(User.filterFields(existingUser)),
        cookieConfig
      );
      res.cookie("valid", true, cookieConfig);
      if (existingUser.suspended) {
        res.status(200).json({
          user: null,
          valid: false,
          token: null,
          message: "[004] Account suspended by admin.",
        });
        return;
      }
      // redirecting to frontend app
      res.redirect(process.env.FRONTEND_BASE_URL || "/");
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while exchanging code for token");
    }
  });

  app.get("/auth/signout", validatedRequest, async (req, res) => {
    const user = await userFromSession(req, res);

    const existingUser = await User._get({ id: user?.id });
    if (!existingUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    if (!existingUser?.uid) {
      res.json({
        status: false,
        message: "User doesn't have UID in the database",
      });
      return;
    }
    //getting admin token
    const logoutResponse = await KeycloakHelper.logoutUser(existingUser?.uid);
    res.json({ status: logoutResponse });
  });
}

module.exports = { authEndpoints };
