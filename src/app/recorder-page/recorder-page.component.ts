import { ChangeDetectorRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
// simport Recorder from 'recorder-js';

@Component({
  selector: 'app-recorder-page',
  templateUrl: './recorder-page.component.html',
  styleUrls: ['./recorder-page.component.css']
})
export class RecorderPageComponent implements OnInit, AfterViewInit {
  // public data = 'https://p.scdn.co/mp3-preview/6d00206e32194d15df329d4770e4fa1f2ced3f57#t=,1'
  // public player: any;
  // public currentTime: any;
  public isRecording = false;
  public audioChunks: any;
  public audioUrl: any;
  public blobFile: any;
  public uploadAudioDetails: any;
  public recorder: any;
  public recordAudio: any;
  public recordingTimer: any;
  public timerInterval: any = `00:00`;
  public audioElement: any;
  public recordings: Array<any> = [];
  public targetDuration: Array<any> = [];
  public audioRecords: Array<any> = [];
  ;
  constructor(private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.prepareAudioData();
    this.cd.detectChanges()
  }

  ngOnInit(): void {


    this.recordAudio = () => {
      return new Promise((resolve) => {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            console.log(stream);
            const mediaRecorder = new MediaRecorder(stream, {
              mimeType: 'audio/webm',
              // numberOfAudioChannels: 1,
              audioBitsPerSecond: 16000,
            });
            this.audioChunks = [];

            mediaRecorder.addEventListener('dataavailable', (event) => {
              console.log(event);
              this.audioChunks.push(event.data);
            });

            const start = () => {
              mediaRecorder.start();
            };

            const stop = () => {
              return new Promise((resolve) => {
                mediaRecorder.addEventListener('stop', (e) => {
                  const audioBlob = new Blob(this.audioChunks, { 'type': 'audio/wav; codecs=MS_PCM' });
                  this.blobFile = audioBlob;
                  // const reader = new FileReader();
                  // reader.readAsDataURL(audioBlob);
                  // reader.addEventListener('load', (e) => {
                  //   const base64data = reader.result;
                  //   this.uploadAudioDetails = e.target?.result;

                  //   // this.http.post('apiUrl', this.sendObj, httpOptions).subscribe(data => console.log(data));
                  // }, false);
                  // reader.onload = (e: any) => {
                  //   console.log(e.target.result);
                  // };
                  this.audioElement = document.getElementById('audio');
                  const audioUrl = URL.createObjectURL(audioBlob);
                  const domUrl = this.domSanitizer.bypassSecurityTrustUrl(audioUrl);
                  this.recordings.push(audioUrl);
                  const data = {
                    url: audioUrl,
                  }
                  this.audioRecords.push(data);
                  this.prepareAudioData();

                  // this.audioElement = audio;
                  const play = () => {
                    // audio.play();
                  };
                  resolve({ audioBlob, audioUrl, play });
                });

                mediaRecorder.stop();
              });
            };
            resolve({ start, stop });
            this.cd.detectChanges();
          });
      });
    };

  }


  /**
   *start recording
   */
  async startRecording() {
    this.isRecording = true;
    this.recorder = await this.recordAudio();
    console.log(this.recorder);
    this.recorder.start();
    this.startCountdown();
  }
  /**
   *stop recording
   */
  async stopRecording() {
    this.isRecording = false;
    const audio = await this.recorder.stop();
    // audio.play();
    this.startCountdown(true);
  }

  /**
   * @param clearTime default value `false`
   * `false` miens recording start if getting `true` then we are stop counting `clearStream`
   * Maximum Recoding time `10`Minutes @see minutes == 10
   */
  startCountdown(clearTime = false) {
    if (clearTime) {
      clearInterval(this.timerInterval);
      return;
    } else {
      this.recordingTimer = `00:00`;
      this.cd.detectChanges();
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      let timer: any = this.recordingTimer;
      timer = timer.split(':');
      let minutes = +timer[0];
      let seconds = +timer[1];

      if (minutes == 10) {
        clearInterval(this.timerInterval);
        return;
      }
      ++seconds;
      if (seconds > 59) {
        ++minutes;
        seconds = 0;
      }

      if (seconds < 10) {
        this.recordingTimer = `0${minutes}:0${seconds}`;
        this.cd.detectChanges();
      } else {
        this.recordingTimer = `0${minutes}:${seconds}`;
        this.cd.detectChanges();
      }
    }, 1000);
  }

  /**
   * sanitizing url
   * @param {any} url
   * @return {any}
   */
  public sanitizeUrl(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  /**
     * prepare data
     * @param {object} isChanged
     */
  public prepareAudioData() {

    this.audioRecords.map((data: any, index: number) => {
      data.audioId = `audioId${index}`;
      data.sliderId = `sliderId${index}`;
      data.audio = <HTMLAudioElement>document.getElementById(`audioId${index}`);
      data.slider = <HTMLInputElement>document.getElementById(`sliderId${index}`);
      data.loaded = false;

      if (data.audio) {
        data.audio.currentTime = 0;
      }
      data.audioId = `audioId${index}`;
      data.sliderId = `sliderId${index}`;
      data.audio = <HTMLAudioElement>document.getElementById(`audioId${index}`);
      data.slider = <HTMLInputElement>document.getElementById(`sliderId${index}`);
      data.loaded = false;

      if (data.audio) {
        this.targetAudioListeners(data);
        if (data.audio) {
          data.audio.currentTime = 0;
        }
      } else {
        setTimeout(() => {
          data.audio = <HTMLAudioElement>document.getElementById(`audioId${index}`);
          data.slider = <HTMLInputElement>document.getElementById(`sliderId${index}`);
          this.targetAudioListeners(data);
          if (data.audio) {
            data.audio.currentTime = 0;
          }
        }, 1000);
      }
    })
    this.cd.detectChanges();
  }


  /**
   * duration settings
   * @param {any} data
   */
  private targetAudioListeners(data: any) {
    console.log(data);
    if (data.audio) {
      data.audio.addEventListener('loadedmetadata', function () {
        data.audio.currentTime = 0;
      });

      data.audio.ondurationchange = (e: any) => {
        console.log('duration updated');
        if (e?.target?.duration == data.audio.currentTime) {
          data.audio.currentTime = 0;
          data.loaded = true;
        }
      };
      data.audio.onended = (e: any) => {
        console.log('Audio ended');
        data.audio.currentTime = 0;
      };

      data.audio.ontimeupdate = (e: any) => {
        console.log('time updated');
        data.slider.style.background = `linear-gradient(to right, #205CD5 0%, #1d4ed81a ${(data?.audio?.currentTime) / (data?.audio?.duration) * 100}%)`;
      };
    }
    this.cd.detectChanges();
  }

  /**
   * set target duration
   * @param {number} data
   */
  // public setTargetDuration(i: number) {
  //   this.recordings[i].audio.currentTime = this.targetDuration[i];
  // }

}
