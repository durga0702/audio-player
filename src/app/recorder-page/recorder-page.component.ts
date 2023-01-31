import { Component, OnInit } from '@angular/core';
// simport Recorder from 'recorder-js';

@Component({
  selector: 'app-recorder-page',
  templateUrl: './recorder-page.component.html',
  styleUrls: ['./recorder-page.component.css']
})
export class RecorderPageComponent implements OnInit {
  public data = 'https://p.scdn.co/mp3-preview/6d00206e32194d15df329d4770e4fa1f2ced3f57#t=,1'
  public player: any;
  public currentTime: any;

  constructor() { }

  ngOnInit(): void {
    this.player = document.getElementById('audio-player');
    // this.data["src"] = 'https://p.scdn.co/mp3-preview/6d00206e32194d15df329d4770e4fa1f2ced3f57#t=,1';
    this.player.addEventListener('loadedmetadata', () => {
      this.currentTime = 24 * 60 * 600;
    });
    this.player.ondurationchange('loadedmetadata', () => {
      this.currentTime = 24 * 60 * 600;
    });

  }
  playSong() {
    this.player.play();
    this.currentTime = this.player.currentTime;

  }



}
