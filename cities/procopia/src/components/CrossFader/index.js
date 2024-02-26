export class CrossFader {
  constructor(context, fadeSeconds = 10) {
    this.context = context;
    this.isPlaying = false;
    this.isFading = false;
    this.lastCtl = null;
    this.fadeSeconds = fadeSeconds;
    this.nextFile = null;
  }

  setContext(context) {
    this.context = context;
  }

  hasContext() {
    return !!this.context;
  }

  async setFile(file, setStatus) {
    if (!file) {
      return;
    }

    if (this.isFading) {
      this.nextFile = file;
      return;
    }

    const isChanging = this.lastCtl && this.file !== file;
    this.file = file;
    if (!this.isPlaying || !this.context) {
      return;
    }
    if (isChanging) {
      this.isFading = true;
      await this.fade(setStatus);
      this.isFading = false;
      if (this.nextFile) {
        const nextFile = this.nextFile;
        this.nextFile = null;
        this.setFile(nextFile, setStatus);
      }
    } else {
      this.play();
    }
  }

  loadBuffer(path) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('GET', path, true);
      request.responseType = 'arraybuffer';

      request.onload = () => {
        this.context.decodeAudioData(request.response, resolve, reject);
      };
      request.send();
    });
  }

  createSource(buffer) {
    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNode);
    gainNode.connect(this.context.destination);
    return {
      source: source,
      gainNode: gainNode,
    };
  }

  async play() {
    const buffer = await this.loadBuffer(this.file);
    const ctl = this.createSource(buffer);
    ctl.source[ctl.source.start ? 'start' : 'noteOn'](0);
    this.lastCtl = ctl;
    this.isPlaying = true;
  }

  stop() {
    this.lastCtl.source[this.lastCtl.source.stop ? 'stop' : 'noteOff'](0);
    this.isPlaying = false;
  }

  async fade(setStatus) {
    return new Promise(async (resolve, reject) => {
      try {
        setStatus(`Loading ${this.file}`);
        const buffer = await this.loadBuffer(this.file);
        setStatus(`Creating source`);
        const newCtl = this.createSource(buffer);
        newCtl.gainNode.gain.value = 0;
        const currTime = this.context.currentTime;
        newCtl.source[newCtl.source.start ? 'start' : 'noteOn'](0, currTime);
        setStatus(`Fading in ${this.file}`);
        this.lastCtl.gainNode.gain.linearRampToValueAtTime(1, currTime);
        this.lastCtl.gainNode.gain.linearRampToValueAtTime(
          0,
          currTime + this.fadeSeconds
        );
        newCtl.gainNode.gain.linearRampToValueAtTime(0, currTime);
        newCtl.gainNode.gain.linearRampToValueAtTime(
          1,
          currTime + this.fadeSeconds
        );
        const prevCtl = this.lastCtl;
        this.lastCtl = newCtl;
        setTimeout(() => {
          prevCtl.source.disconnect();
          prevCtl.gainNode.disconnect();
          resolve();
        }, this.fadeSeconds * 1000);
      } catch (err) {
        reject(err);
        return;
      }
    });
  }

  toggle() {
    this.isPlaying ? this.stop() : this.play();
  }
}
