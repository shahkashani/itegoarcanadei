const express = require('express');
const { resolve } = require('path');

const COMMON_ASSETS_FOLDER = resolve(__dirname, '../assets/common');
const FAVICON = resolve(__dirname, '../assets/favicon.ico');
const ROBOTS = resolve(__dirname, '../assets/robots.txt');

const addCommonAssetsRoute = (app) => {
  app.use('/common', express.static(COMMON_ASSETS_FOLDER));
  app.use('/robots.txt', express.static(ROBOTS));
};

module.exports = {
  addCommonAssetsRoute,
};
