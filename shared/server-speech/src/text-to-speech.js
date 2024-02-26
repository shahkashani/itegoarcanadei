const { unlinkSync, copyFileSync } = require('fs');
const { sample, map, uniq, flatten, range } = require('lodash');
const { parse } = require('path');
const speachSdk = require('microsoft-cognitiveservices-speech-sdk');
const cp = require('child_process');

class TextToSpeech {
  constructor({
    token,
    region = 'eastus',
    voiceLanguage = null,
    isVerbose = false,
    pan = 0.8,
  } = {}) {
    this.speechConfig = speachSdk.SpeechConfig.fromSubscription(token, region);
    this.voiceLanguage = voiceLanguage;
    this.isVerbose = isVerbose;
    this.pan = pan;
  }

  async execCmd(cmd) {
    return new Promise((resolve, reject) => {
      cp.exec(cmd, (err, stdout, stderr) => {
        if (err) {
          return reject(stderr);
        }
        resolve(stdout);
      });
    });
  }

  async getVoices() {
    if (this.voiceList) {
      return this.voiceList;
    }
    const synthesizer = new speachSdk.SpeechSynthesizer(this.speechConfig);
    const { voices } = await synthesizer.getVoicesAsync();
    this.voiceList = this.voiceLanguage
      ? voices.filter((voice) => voice.locale.match(this.voiceLanguage))
      : voices;
    const styles = uniq(flatten(map(this.voiceList, 'styleList')));
    if (this.isVerbose) {
      console.log(`\n👨‍🎤 Available styles: `, styles);
    }
    return this.voiceList;
  }

  async getVoice({ style, name, gender }) {
    const voices = await this.getVoices();
    let returnStyle = style;

    const genderMap = { female: 1, male: 2 };
    let useVoices = voices;

    if (name) {
      useVoices = voices.filter(
        (voice) => voice.shortName === name || voice.localName === name
      );
      if (useVoices.length === 0) {
        if (this.isVerbose) {
          console.error(`⚠️  Could not find voice ${name}`);
        }
        useVoices = voices;
      }
    }

    if (style) {
      const preStyleFilter = useVoices;
      useVoices = useVoices.filter(
        (voice) => voice.styleList.indexOf(style) !== -1
      );
      if (this.isVerbose) {
        console.log(
          `☕️ Filtered down to ${useVoices.length} voices based on style ${style}.`
        );
      }
      if (useVoices.length === 0) {
        if (this.isVerbose) {
          console.error(
            '⚠️  Filtered down to zero voices. Removing style filter.'
          );
        }
        useVoices = preStyleFilter;
      }
    }

    if (gender) {
      if (!genderMap[gender]) {
        console.error(`⚠️ Gender ${gender} not supported.`);
      } else {
        const preGenderFilter = useVoices;
        useVoices = useVoices.filter(
          (voice) => voice.gender === genderMap[gender]
        );
        if (this.isVerbose) {
          console.log(
            `☕️ Filtered down to ${useVoices.length} voices based on gender ${gender}.`
          );
        }
        if (useVoices.length === 0) {
          if (this.isVerbose) {
            console.error(
              '⚠️  Filtered down to zero voices. Removing gender filter.'
            );
          }
          useVoices = preGenderFilter;
        }
      }
    }

    if (useVoices.length === 0) {
      if (this.isVerbose) {
        console.error(
          '⚠️  Filtered down to zero voices. Using the full set instead.'
        );
      }
      useVoices = voices;
    }

    if (this.isVerbose) {
      console.log(`\n🧑‍🎤 Picking one of these`, map(useVoices, 'shortName'));
    }
    const returnVoice = sample(useVoices);

    if (
      !returnStyle &&
      returnVoice.styleList &&
      returnVoice.styleList.length > 0
    ) {
      if (this.isVerbose) {
        console.log(
          `\n👨‍🎤 Voice ${returnVoice.shortName} has styles`,
          returnVoice.styleList
        );
      }
      returnStyle = sample(returnVoice.styleList);
    }

    return {
      voice: returnVoice.shortName,
      style: returnStyle,
    };
  }

  async textToSpeech(
    text,
    output,
    config,
    { effects } = {},
    pronunciations = {}
  ) {
    const configs = Array.isArray(config) ? config : [config];
    const usePronunciations = pronunciations || {};
    const voices = configs.length;
    if (voices < 2) {
      await this.createTextToSpeech(
        text,
        output,
        configs[0],
        usePronunciations
      );
      if (effects) {
        await this.applyEffects(output, effects);
      }
      return;
    }

    const { dir, base } = parse(output);
    const files = range(1, voices + 1).map(
      (i) => `${dir ? `${dir}/` : ''}${i} - ${base}`
    );

    let iConfig = 0;
    for (let file of files) {
      await this.createTextToSpeech(
        text,
        file,
        config[iConfig],
        usePronunciations
      );
      iConfig += 1;
    }

    const is = files.map((file) => `-i "${file}"`);
    const as = files.map((_file, i) => `[${i}:a]`);
    const pan =
      voices < 3 && Number.isFinite(this.pan)
        ? `,pan=stereo|c0=${this.pan}*c0+${1 - this.pan}*c1|c1=${this.pan}*c1+${
            1 - this.pan
          }*c0`
        : '';
    const cmd = `ffmpeg ${is.join(' ')} -filter_complex "${as.join(
      ''
    )}amerge=inputs=${voices}${pan}[a]" -map "[a]" -ac 2 -y "${output}"`;

    await this.execCmd(cmd);

    for (let file of files) {
      unlinkSync(file);
    }

    if (effects) {
      await this.applyEffects(output, effects);
    }
  }

  async createTextToSpeech(
    input,
    output,
    { name, type, gender, effects, rate, pitch, contour, volume, degree } = {},
    pronunciations = {}
  ) {
    if (this.isVerbose) {
      console.log('\n🕋 Synthesizing');
    }
    const hasPronunciations = Object.keys(pronunciations).length > 0;
    const { voice, style } = await this.getVoice({
      name: name,
      style: type,
      gender: gender,
    });
    if (this.isVerbose) {
      console.log(`\n🎙️  Voice: ${voice}${style ? `, style: ${style}` : ''}`);
    }
    const audioConfig = speachSdk.AudioConfig.fromAudioFileOutput(output);
    const synthesizer = new speachSdk.SpeechSynthesizer(
      this.speechConfig,
      audioConfig
    );
    const textString = speachSdk.SpeechSynthesizer.XMLEncode(input);
    const sRate = rate ? ` rate="${rate}"` : '';
    const sPitch = pitch ? ` pitch="${pitch}"` : '';
    const sContour = contour ? ` contour="${contour}"` : '';
    const sVolume = volume ? ` volume="${volume}"` : '';
    const sStyle = style ? ` style="${style}"` : '';
    const sDegree = degree ? ` styledegree="${degree}"` : '';
    let prosodyStart = '';
    let prosodyEnd = '';

    let useText = textString;

    if (hasPronunciations) {
      const regexp = new RegExp(Object.keys(pronunciations).join('|'), 'g');
      useText = textString.replace(regexp, (word) => {
        return `<phoneme alphabet="ipa" ph="${pronunciations[word]}">${word}</phoneme>`;
      });
    }
    if (sRate || sPitch || sContour || sVolume) {
      prosodyStart = `<prosody${sRate}${sPitch}${sContour}${sVolume}>`;
      prosodyEnd = '</prosody>';
    }

    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
  <voice name="${voice}">
    <mstts:express-as${sStyle}${sDegree}>${prosodyStart}${useText}${prosodyEnd}</mstts:express-as>
  </voice>
</speak>`;

    if (this.isVerbose) {
      console.log(`\n${ssml}`);
    }

    await new Promise((resolve, reject) => {
      synthesizer.speakSsmlAsync(
        ssml,
        async (result) => {
          synthesizer.close();
          if (effects) {
            await this.applyEffects(output, effects);
          }
          resolve(output);
        },
        (error) => {
          synthesizer.close();
          reject(error);
        }
      );
    });

    return output;
  }

  async applyEffects(output, effects) {
    if (this.isVerbose) {
      console.log(`💅 Applying effects: ${effects}`);
    }
    const { dir, base } = parse(output);
    const effected = `${dir ? `${dir}/` : ''}effected - ${base}`;
    await this.execCmd(`sox "${output}" "${effected}" ${effects}`);
    copyFileSync(effected, output);
    unlinkSync(effected);
  }
}

module.exports = TextToSpeech;
