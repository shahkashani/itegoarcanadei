const { createClient } = require('redis');

const KEY_SHARD_LEFT = 'leonia-shard-left';
const KEY_SHARD_RIGHT = 'leonia-shard-right';
const KEY_UNLOCK_SHARDS = 'leonia-shards';
const KEY_CAN_SEE_MESSAGE_BUTTON = 'leonia-message-button';
const KEY_CAN_SEE_LOG_BUTTON = 'leonia-log-button';
const KEY_CAN_TRAVEL_FREELY = 'leonia-free-travel';
const KEY_CAN_SEE_EUPHEMIA_BOOK = 'leonia-see-book';
const KEY_CAN_GET_EUPHEMIA_BOOK = 'leonia-get-book';
const KEY_OPEN_ON_STORE = 'leonia-open-on-store';
const KEY_CAN_SEE_PORTAL = 'leonia-portal';

const KEY_MESSAGES_ADROGUE = 'leonia-adrogue';
const KEY_MESSAGES_STORYKEEPER = 'leonia-storykeeper';
const KEY_START_HOUR = 'leonia-start-hour';
const KEY_END_HOUR = 'leonia-end-hour';
const KEY_ROOM_COLOR = 'leonia-color';
const KEY_CLOCK_TICK = 'leonia-tick';
const KEY_IS_UNAVAILABLE = 'leonia-unavailable';

const TRUE = 'true';

class LeoniaManager {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.log('Database error', err));
  }
  connect = async () => {
    if (this.client.isOpen) {
      return;
    }
    await this.client.connect();
    console.log('Connected to stage manager!');
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

  async getMessagesAdrogue() {
    return JSON.parse(await this.getKey(KEY_MESSAGES_ADROGUE)) || [];
  }

  async getMessagesStorykeeper() {
    return JSON.parse(await this.getKey(KEY_MESSAGES_STORYKEEPER)) || [];
  }

  async addMessageAdrogue(message) {
    const messages = await this.getMessagesAdrogue();
    messages.push(message);
    await this.setKey(KEY_MESSAGES_ADROGUE, JSON.stringify(messages));
  }

  async addMessageStorykeeper(message) {
    const messages = await this.getMessagesStorykeeper();
    messages.push(message);
    await this.setKey(KEY_MESSAGES_STORYKEEPER, JSON.stringify(messages));
  }

  async deleteMessageAdrogue(id) {
    const messages = await this.getMessagesAdrogue();
    if (!messages.find((message) => message.id === id)) {
      return;
    }
    const newMessages = messages.filter((message) => message.id !== id);
    await this.setKey(KEY_MESSAGES_ADROGUE, JSON.stringify(newMessages));
  }

  async deleteMessageStorykeeper(id) {
    const messages = await this.getMessagesStorykeeper();
    if (!messages.find((message) => message.id === id)) {
      return;
    }
    const newMessages = messages.filter((message) => message.id !== id);
    await this.setKey(KEY_MESSAGES_STORYKEEPER, JSON.stringify(newMessages));
  }

  async deleteMessage(id) {
    await this.deleteMessageAdrogue(id);
    await this.deleteMessageStorykeeper(id);
  }

  async setUnlockedShards(value = true) {
    await this.setTrue(KEY_UNLOCK_SHARDS, value);
  }

  async setCanSeeMessageButton(value = true) {
    await this.setTrue(KEY_CAN_SEE_MESSAGE_BUTTON, value);
  }

  async setCanSeeLogButtonButton(value = true) {
    await this.setTrue(KEY_CAN_SEE_LOG_BUTTON, value);
  }

  async setCanTravelFreely(value = true) {
    await this.setTrue(KEY_CAN_TRAVEL_FREELY, value);
  }

  async setCanSeeEuphemiaBook(value = true) {
    await this.setTrue(KEY_CAN_SEE_EUPHEMIA_BOOK, value);
  }

  async setCanGetEuphemiaBook(value = true) {
    await this.setTrue(KEY_CAN_GET_EUPHEMIA_BOOK, value);
  }

  async setIsRoomColor(value = true) {
    await this.setTrue(KEY_ROOM_COLOR, value);
  }

  async setCanSeePortal(value = true) {
    await this.setTrue(KEY_CAN_SEE_PORTAL, value);
  }

  async setStartHour(value) {
    await this.setKey(KEY_START_HOUR, value.toString());
  }

  async setEndHour(value) {
    await this.setKey(KEY_END_HOUR, value.toString());
  }

  async setGivenLeftShard() {
    await this.setTrue(KEY_SHARD_LEFT);
  }

  async setGivenRightShard() {
    await this.setTrue(KEY_SHARD_RIGHT);
  }

  async setIsOpenOnStore(value = true) {
    await this.setTrue(KEY_OPEN_ON_STORE, value);
  }

  async setIsClockTick(value = true) {
    await this.setTrue(KEY_CLOCK_TICK, value);
  }

  async setIsUnavailable(value = true) {
    await this.setTrue(KEY_IS_UNAVAILABLE, value);
  }

  async hasUnlockedShards() {
    return await this.isTrue(KEY_UNLOCK_SHARDS);
  }

  async hasLeftShard() {
    return await this.isTrue(KEY_SHARD_LEFT);
  }

  async hasRightShard() {
    return await this.isTrue(KEY_SHARD_RIGHT);
  }

  async canSeeMessageButton() {
    return await this.isTrue(KEY_CAN_SEE_MESSAGE_BUTTON);
  }

  async canSeeLogButton() {
    return await this.isTrue(KEY_CAN_SEE_LOG_BUTTON);
  }

  async canTravelFreely() {
    return await this.isTrue(KEY_CAN_TRAVEL_FREELY);
  }

  async canGetEuphemiaBook() {
    return await this.isTrue(KEY_CAN_GET_EUPHEMIA_BOOK);
  }

  async canSeeEuphemiaBook() {
    return await this.isTrue(KEY_CAN_SEE_EUPHEMIA_BOOK);
  }

  async canSeePortal() {
    return await this.isTrue(KEY_CAN_SEE_PORTAL);
  }

  async isOpenOnStore() {
    return await this.isTrue(KEY_OPEN_ON_STORE);
  }

  async getStartHour() {
    return parseInt((await this.getKey(KEY_START_HOUR)) || 10);
  }

  async getEndHour() {
    return parseInt((await this.getKey(KEY_END_HOUR)) || 11);
  }

  async isRoomColor() {
    return await this.isTrue(KEY_ROOM_COLOR);
  }

  async isClockTick() {
    return await this.isTrue(KEY_CLOCK_TICK);
  }

  async isUnavailable() {
    return await this.isTrue(KEY_IS_UNAVAILABLE);
  }
}

module.exports = LeoniaManager;
