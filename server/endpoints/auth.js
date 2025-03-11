process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

const { makeJWT, userFromSession, decodeKeycloakJWT } = require("../utils/http");
const { User } = require("../models/user");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { ROLES } = require("../utils/middleware/multiUserProtected");
const crypto = require("crypto");
const { Workspace } = require("../models/workspace");
const { KeycloakHelper } = require("../utils/keycloak");
const ALLOWED_ENV_VARS = ["KC_BASE_URL", "KC_REALM", "KC_CLIENT_ID_CHAT_PLUGIN"]; // Define allowed env vars

const setCookies = (res, userDetails, userGroups) => {
  const fullAuthResponse = {
    valid: true,
    user: User.filterFields(userDetails),
    token: makeJWT(
      {
        id: userDetails.id,
        username: userDetails.username,
        uid: userDetails?.uid,
        groups: userGroups
      },
      "60d"
    ),
    message: null,
  };
  const cookieConfig = {
    maxAge: 900000,
    httpOnly: false,  // Secure from client-side JS access
    secure: false,    // Required for SameSite=None
  };
  res.cookie("token", fullAuthResponse.token, cookieConfig);
  res.cookie(
    "user",
    JSON.stringify(User.filterFields(userDetails)),
    cookieConfig
  );
  res.cookie("valid", true, cookieConfig);
};
async function callBackHandler(code, redirectUrl, kcClientId, kcClientSecret) {
  // const code = req.query.code;
  // if (!code) {
  //   return res.status(400).send("No code found");
  // }
  const userInfo = await KeycloakHelper.getUserInfoByCode(code, redirectUrl, kcClientId, kcClientSecret);

  const keycloakGroups = userInfo?.user?.keycloakgroups || [];
  const samlGroups = userInfo?.user?.samlgroups || [];
  const userGroups = [...new Set([...keycloakGroups, ...samlGroups])];
  let existingUser = await User._get({
    username: String(userInfo?.user?.username),
  });

  if (!existingUser) {
    existingUser = (
      await User.create({
        username: userInfo?.user?.username,
        password: crypto.randomUUID(),
        role: ROLES.default,
        uid: userInfo?.sub,
      })
    )?.user;
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
  // update user groups
  await User._update(existingUser?.id, {
    grps: userGroups.join(", "),
  });

  return { existingUser, userGroups }
}

function authEndpoints(app) {
  if (!app) return;

  // this route will handle the login request and redirect it to keycloak for authentication
  app.get("/auth", async (req, res) => {
    const authUrl = KeycloakHelper.getAuthRedirectUrl();
    res.redirect(authUrl);
  });

  // // this route will handle the login request and redirect it to keycloak for authentication
  // app.get("/auth/chat-plugin", async (req, res) => {

  //   const authUrl = KeycloakHelper.getAuthRedirectUrl(process.env.KC_REDIRECT_URL_CHAT_PLUGIN);
  //   res.redirect(authUrl);
  // });

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
      const { existingUser, userGroups } = await callBackHandler(code, process.env.KC_REDIRECT_URL, process.env.KC_CLIENT_ID, process.env.KC_CLIENT_SECRET);

      const redirectUrl = process.env.FRONTEND_BASE_URL || "/";
      if (existingUser?.suspended) {
        await KeycloakHelper.logoutUser(existingUser?.uid);
        res.redirect(`${redirectUrl}suspended-user`);
        return;
      }
      setCookies(res, existingUser, userGroups);
      // redirecting to frontend app
      res.redirect(redirectUrl);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error while exchanging code for token");
    }
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
  app.get("/auth/callback/chat-plugin", async (req, res) => {
    const code = req.query.code;
    let keRedirectUrl = req.query.redirecturl 
    ? `${process.env.KC_REDIRECT_URL_CHAT_PLUGIN}?redirecturl=${req.query.redirecturl}` 
    : process.env.KC_REDIRECT_URL_CHAT_PLUGIN;
    // console.log("redirect url : ", keRedirectUrl)
    if (!code) {
      return res.status(400).send("No code found");
    }
    try {
      const { existingUser, userGroups } = await callBackHandler(code, keRedirectUrl, process.env.KC_CLIENT_ID_CHAT_PLUGIN, process.env.KC_CLIENT_SECRET_CHAT_PLUGIN);
      // redirectUrl = process.env.FRONTEND_BASE_URL_CHAT_PLUGIN || "/";
      const frontEndRedirect = req.query.redirecturl || process.env.FRONTEND_BASE_URL_CHAT_PLUGIN || "/";

      if (existingUser?.suspended) {
        await KeycloakHelper.logoutUser(existingUser?.uid);
        // res.redirect(`${redirectUrl}suspended-user`);
        res.status(403).send("User is suspended");
        return;
      }
      setCookies(res, existingUser, userGroups);
      // redirecting to frontend app
      // res.status(200).json({ success: true, redirectUrl: frontEndRedirect });
      res.redirect(frontEndRedirect);
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

  app.get("/env/:slug", (req, res) => {
    const requestedVar = req.params.slug;

    if (!ALLOWED_ENV_VARS.includes(requestedVar)) {
        return res.status(403).json({ error: "Access to this variable is not allowed" });
    }

    const value = process.env[requestedVar];

    if (!value) {
        return res.status(404).json({ error: "Variable not found or not set" });
    }

    res.json({ [requestedVar]: value });
});
  // app.get("/auth/get-prism-token", async (req, res) => {

  //   const authHeader = req.headers['authorization'];

  //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //     return res.status(401).json({ error: "Unauthorized: No Bearer token provided" });
  //   }

  //   const token = authHeader.split(" ")[1];
  //   const userInfo = decodeKeycloakJWT(token)
  //   if (!userInfo) {
  //     console.debug("not a valid JWT Token")
  //     return res.status(400).json({ error: "Bearer Token is not decodable" });
  //   }

  //   const keycloakGroups = userInfo?.user?.keycloakgroups || [];
  //   const samlGroups = userInfo?.user?.samlgroups || [];
  //   const userGroups = [...new Set([...keycloakGroups, ...samlGroups])];

  //   let existingUser = await User._get({
  //     username: String(userInfo?.user?.username),
  //   });

  //   if (!existingUser) {
  //     existingUser = (
  //       await User.create({
  //         username: userInfo?.user?.username,
  //         password: crypto.randomUUID(),
  //         role: ROLES.default,
  //         uid: userInfo?.sub,
  //       })
  //     )?.user;
  //     await Workspace.addToDefaultWorkspace(existingUser?.id);
  //   } else {
  //     const isUserInDefaultWS = await Workspace.isUserInDefaultWS(
  //       existingUser?.id
  //     );
  //     if (!isUserInDefaultWS) {
  //       await Workspace.addToDefaultWorkspace(existingUser?.id);
  //     }
  //     if (!existingUser?.uid || existingUser?.uid !== userInfo?.sub) {
  //       existingUser = await User.update(existingUser?.id, {
  //         uid: userInfo?.sub,
  //       });
  //     }
  //   }

  //   const redirectUrl = process.env.FRONTEND_BASE_URL || "/";
  //   if (existingUser?.suspended) {
  //     await KeycloakHelper.logoutUser(existingUser?.uid);
  //     res.redirect(`${redirectUrl}suspended-user`);
  //     return;
  //   }
  //   const prismToken = makeJWT(
  //     {
  //       id: existingUser.id,
  //       username: existingUser.username,
  //       uid: existingUser?.uid,
  //       groups: userGroups
  //     },
  //     "60d"
  //   )

  //   res.json({ token: prismToken });
  // });
}

module.exports = { authEndpoints };
