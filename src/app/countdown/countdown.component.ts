import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, EventEmitter, Output, OnChanges } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'countdown',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss'],
  })

  export class CountdownComponent implements OnInit, OnChanges, OnDestroy {
    
    @Input()
    public totalTime: number = 60;
    @Input()
    public stopTime: boolean = false;

    @Output() timerCompleted = new EventEmitter<boolean>();
    
    public height: number = 500;
    public interval: any;
    public fillHeight: number;
    public remainingTime: number;
    public subscribe: Subscription;

    constructor(private changeDetector: ChangeDetectorRef) {

    }
    public ngOnInit() {
      this.subscribe = interval(100).subscribe( (value: number) => {
        value/=10; //smoothing effect
        this.fillHeight = (this.totalTime-value)/this.totalTime*this.height;
        if(value === this.totalTime ) {
          this.timerCompleted.emit(true);
          this.subscribe.unsubscribe();
        }
        this.remainingTime = Math.floor(this.totalTime-value);
        this.changeDetector.detectChanges();
      });
    }

    public ngOnChanges() {
      if(this.stopTime){
        this.subscribe.unsubscribe();
      }
    }
    public ngOnDestroy() {
      this.subscribe.unsubscribe();
    }
  }