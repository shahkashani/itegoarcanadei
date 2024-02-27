const jwt = require('jsonwebtoken');
const express = require('express');
const { resolve } = require('path');

const COMMON_ASSETS_FOLDER = resolve(__dirname, '../assets/common');
const FAVICON = resolve(__dirname, '../assets/favicon.ico');
const ROBOTS = resolve(__dirname, '../assets/robots.txt');

const isPasswordCorrect = (password1, password2) =>
  (password1 || '').trim().toLowerCase() ===
  (password2 || '').trim().toLowerCase();

const verifyLogin = (req, res, next, cookieName, secretKey, renderLogin) => {
  const token = req.cookies[cookieName];
  if (!token) {
    return renderLogin(req, res, next);
  }
  try {
    jwt.verify(token, secretKey);
    return next();
  } catch {
    return renderLogin(req, res, next);
  }
};

const addLoginRoute = (
  app,
  cookieName,
  password,
  secretKey,
  passwordHandler = null,
  callbackHandler = null
) => {
  const usePasswordFn = passwordHandler || isPasswordCorrect;
  const callbackFn = callbackHandler || ((res) => res.sendStatus(200));
  app.post('/login', async (req, res) => {
    const { password: givenPass } = req.body;
    if (usePasswordFn(password, givenPass)) {
      const token = jwt.sign({}, secretKey);
      callbackFn(
        res.cookie(cookieName, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 86400,
        })
      );
    } else {
      res.sendStatus(403);
    }
  });
};

const addCommonAssetsRoute = (app) => {
  app.use('/common', express.static(COMMON_ASSETS_FOLDER));
  app.use('/favicon.ico', express.static(FAVICON));
  app.use('/robots.txt', express.static(ROBOTS));
};

module.exports = {
  addCommonAssetsRoute,
  addLoginRoute,
  verifyLogin,
};
