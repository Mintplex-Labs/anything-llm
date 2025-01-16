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

const setCookies = (res, userDetails) => {
  const fullAuthResponse = {
    valid: true,
    user: User.filterFields(userDetails),
    token: makeJWT(
      {
        id: userDetails.id,
        username: userDetails.username,
        uid: userDetails?.uid,
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
    JSON.stringify(User.filterFields(userDetails)),
    cookieConfig
  );
  res.cookie("valid", true, cookieConfig);
};

function authEndpoints(app) {
  if (!app) return;

  // this route will handle the login request and redirect it to keycloak for authentication
  app.get("/auth", async (req, res) => {
    const authUrl = KeycloakHelper.getAuthRedirectUrl();
    res.redirect(authUrl);
  });

  /**
   * After keycloak finishes the authentication it will redirect to this route
   * The redirection request will have Authorization code
   * This route will call keycloak to get token and user Info by Authorization code
   * After getting the userInfo. the following checks will be performed
   * 1. user already exists?. if not a new user will be created and be assigned to the default workspace
   * 2. if user exists but don't have uid stored or there is a mismatch with uid recieved from keycloak,
   *    the user details will be updated
   */
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

      if (!existingUser) {
        existingUser = await User.create({
          username: userInfo?.user?.username,
          password: crypto.randomUUID(),
          role: ROLES.default,
          uid: userInfo?.sub,
        });
        await Workspace.addToDefaultWorkspace(existingUser?.id);
      } else {
        // check if the user belongs to default workspace
        const isUserInDefaultWS = await Workspace.isUserInDefaultWS(
          existingUser?.id
        );
        if (!isUserInDefaultWS) {
          await Workspace.addToDefaultWorkspace(existingUser?.id);
        }
        // checking if the uid exists and is synced with the one in IDP
        if (!existingUser?.uid || existingUser?.uid !== userInfo?.sub) {
          existingUser = await User.update(existingUser?.id, {
            uid: userInfo?.sub,
          });
        }
      }

      const redirectUrl = process.env.FRONTEND_BASE_URL || "/";
      if (existingUser.suspended) {
        await KeycloakHelper.logoutUser(existingUser?.uid);
        res.redirect(`${redirectUrl}suspended-user`);
        return;
      }
      setCookies(res, existingUser);
      // redirecting to frontend app
      res.redirect(redirectUrl);
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
