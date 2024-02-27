export class AudioPlayer {
  constructor(context) {
    this.context = context;
  }

  setContext(context) {
    this.context = context;
  }

  hasContext() {
    return !!this.context;
  }

  load(path) {
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

  createSource(buffer, { volume = 1, loop = false } = {}) {
    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(gainNode);
    gainNode.gain.value = volume;
    gainNode.connect(this.context.destination);
    return {
      source: source,
      gainNode: gainNode,
    };
  }

  startCtl(ctl) {
    ctl.source[ctl.source.start ? 'start' : 'noteOn'](0);
  }

  stopCtl(ctl) {
    ctl.source[ctl.source.stop ? 'stop' : 'noteOff'](0);
  }

  async play(file, inOptions = {}) {
    const options = inOptions || {};
    const buffer = await this.load(file);
    const ctl = this.createSource(buffer, options);

    return new Promise((resolve) => {
      if (ctl.source.loop || options.stopFn) {
        const stop = () => {
          this.stopCtl(ctl);
          ctl.source.disconnect();
          ctl.gainNode.disconnect();
        };
        const fade = (fadeSeconds) => {
          return new Promise((resolve, reject) => {
            try {
              const currTime = ctl.source.context.currentTime;
              ctl.gainNode.gain.linearRampToValueAtTime(
                ctl.gainNode.gain.value,
                currTime
              );
              ctl.gainNode.gain.linearRampToValueAtTime(
                0,
                currTime + fadeSeconds
              );
              setTimeout(() => {
                stop();
                resolve();
              }, 500 + fadeSeconds * 1000);
            } catch (err) {
              reject(err);
            }
          });
        };
        this.startCtl(ctl);
        resolve({ stop, fade });
      } else {
        let timer;
        if (options.onProgress) {
          timer = setInterval(() => {
            options.onProgress(ctl.source.context.currentTime);
          }, options.progressInterval || 100);
        }
        ctl.source.onended = function () {
          ctl.source.disconnect();
          ctl.gainNode.disconnect();
          if (timer) {
            clearInterval(timer);
          }
          resolve();
        };
        this.startCtl(ctl);
      }
    });
  }
}
