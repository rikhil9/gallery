import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, EventEmitter, Output, OnChanges } from '@angular/core';
import { interval, Subscription } from 'rxjs';

/**
 * Counddown component
 */
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
    
    /**
     * Angular life cycle event
     */
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
    /**
     * LIfe cycle event ovverriden to stop the timer
     */
    public ngOnChanges() {
      if(this.stopTime){
        this.subscribe.unsubscribe();
      }
    }

    /**
     * Life cycle event
     */
    public ngOnDestroy() {
      this.subscribe.unsubscribe();
    }
  }