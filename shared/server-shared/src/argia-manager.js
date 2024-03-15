const { createClient } = require('redis');

const KEY_CAN_SEE_MESSAGE_BUTTON = 'argia-message-button';
const KEY_CAN_SEE_LOG_BUTTON = 'argia-log-button';
const KEY_CAN_SEND_CONFIDENTIAL_MESSAGES = 'argia-confidential';

const KEY_MESSAGES = 'argia-messages';
const KEY_MUSIC = 'argia-music';
const KEY_PRESENT = 'argia-present';
const KEY_PHOTO_GONE = 'argia-photo';

const TRUE = 'true';

class ArgiaManager {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.log('Database error', err));
  }
  connect = async () => {
    if (this.client.isOpen) {
      return;
    }
    await this.client.connect();
  };

  getKey = async (key) => {
    await this.connect();
    return await this.client.get(key);
  };

  setKey = async (key, value) => {
    await this.connect();
    return await this.client.set(key, value);
  };

  deleteKey = async (key) => {
    await this.connect();
    return await this.client.del(key);
  };

  isTrue = async (key) => {
    const value = await this.getKey(key);
    return value === TRUE;
  };

  setTrue = async (key, isTrue = true) => {
    if (isTrue) {
      await this.setKey(key, TRUE);
    } else {
      await this.deleteKey(key);
    }
  };

  async getMessages() {
    return JSON.parse(await this.getKey(KEY_MESSAGES)) || [];
  }

  async addMessage(message) {
    const messages = await this.getMessages();
    messages.push(message);
    await this.setKey(KEY_MESSAGES, JSON.stringify(messages));
  }

  async deleteMessage(id) {
    const messages = await this.getMessages();
    if (!messages.find((message) => message.id === id)) {
      return;
    }
    const newMessages = messages.filter((message) => message.id !== id);
    await this.setKey(KEY_MESSAGES, JSON.stringify(newMessages));
  }

  async setMessageRead(id) {
    const messages = await this.getMessages();
    const newMessages = messages.map((message) => {
      return message.id === id ? { ...message, isRead: true } : message;
    });
    await this.setKey(KEY_MESSAGES, JSON.stringify(newMessages));
  }

  async setCanSeeLogButtonButton(value = true) {
    await this.setTrue(KEY_CAN_SEE_LOG_BUTTON, value);
  }

  async setCanSeeMessageButton(value = true) {
    await this.setTrue(KEY_CAN_SEE_MESSAGE_BUTTON, value);
  }

  async setCanSendConfidentialMessages(value = true) {
    await this.setTrue(KEY_CAN_SEND_CONFIDENTIAL_MESSAGES, value);
  }

  async setIsMusic(value = true) {
    await this.setTrue(KEY_MUSIC, value);
  }

  async setIsPresent(value = true) {
    await this.setTrue(KEY_PRESENT, value);
  }

  async setIsPhotoGone(value = true) {
    await this.setTrue(KEY_PHOTO_GONE, value);
  }

  async canSeeMessageButton() {
    return await this.isTrue(KEY_CAN_SEE_MESSAGE_BUTTON);
  }

  async canSeeLogButton() {
    return await this.isTrue(KEY_CAN_SEE_LOG_BUTTON);
  }

  async isMusic() {
    return await this.isTrue(KEY_MUSIC);
  }

  async isPresent() {
    return await this.isTrue(KEY_PRESENT);
  }

  async isPhotoGone() {
    return await this.isTrue(KEY_PHOTO_GONE);
  }

  async canSendConfidentialMessages() {
    return await this.isTrue(KEY_CAN_SEND_CONFIDENTIAL_MESSAGES);
  }
}

module.exports = ArgiaManager;
