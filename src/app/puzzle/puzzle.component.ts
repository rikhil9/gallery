import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'puzzle',
    templateUrl: './puzzle.component.html',
    styleUrls: ['./puzzle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class PuzzleComponent implements OnInit, OnDestroy {

    public imageUrl: string = '../assets/berlin.jpg';
    public imageSize: number = 700;
    public gridsize: number;
    public boxSize: number;
    public totalBoxes: number;
    public Image: any[] = [];
    public indexes: Array<number> = [];
    public position: Array<number> = [];
    public timerCompleted: boolean; // from countdown component
    public gameCompleted: boolean;
    public showOriginalImage: boolean = true;
    private subscription: Subscription;
    public showDown: number = 3;

    constructor(private changeDetector: ChangeDetectorRef){

    }
    public ngOnInit() {
      this.initializeGame();
      this.breakImageParts(); 
      this.Image = this.randomize(this.Image); 

      this.subscription = timer(1000,1000).subscribe( (value: number ) => {
        this.showDown--;
        if(value === 3) {
          this.showOriginalImage = false;
          this.subscription.unsubscribe();
          
        }
        this.changeDetector.detectChanges();
      });

    }

    public initializeGame(): void {

      this.gridsize = Number(3);
      this.boxSize = 100 / (this.gridsize - 1);
      this.totalBoxes = this.gridsize * this.gridsize;
    }

    public  breakImageParts(): void {
      for (let index: number = 0; index < this.totalBoxes; index++) {
        const x: string = (this.boxSize * (index % this.gridsize)) + '%';
        const y: string = (this.boxSize * Math.floor(index / this.gridsize)) + '%';
        let image: ImageBox = new ImageBox();
        image.x_pos = x;
        image.y_pos = y;
        image.index = index;
        this.indexes.push(index);
        this.Image.push(image);
      }
      this.boxSize = this.imageSize / this.gridsize;
    }

    public randomize(imageParts: any[]): Array<ImageBox> {
      let image: Array<ImageBox> = [], randomNumber: number = 0;
      for (let index: number = 0; index < imageParts.length; index++) {
        randomNumber = Math.floor(Math.random() * imageParts.length);
        while (imageParts[randomNumber] === null) {
          randomNumber = Math.floor(Math.random() * imageParts.length);
        }
        image.push(imageParts[randomNumber]);
        this.position.push(imageParts[randomNumber].index);
        imageParts[randomNumber] = null;
      }
      return image;
    }

    public onDragStart(event: any): void {
      if(!this.timerCompleted)
      event.dataTransfer.setData('data', event.target.id);
    }
    public onDrop(event: any): void {
      if(!this.timerCompleted) {
        let origin = event.dataTransfer.getData('data');
        let destination = event.target.id;
    
    
        let originElement = document.getElementById(origin);
        let destinationElement = document.getElementById(destination);
    
        let originStyle = originElement.style.cssText;
        let destinationStyle = event.target.style.cssText;
    
    
      destinationElement.style.cssText = originStyle;
      originElement.style.cssText = destinationStyle;
      originElement.id = destination;
      destinationElement.id = origin;
    
    
        for (let index: number = 0; index < this.position.length; index++) {
          if (this.position[index].toString() === originElement.id) {
            this.position[index] = Number(destinationElement.id);
          } else if (this.position[index].toString() === destinationElement.id) {
            this.position[index] = Number(originElement.id);
          }
    
        } 
    
        if(this.getCompletionStatus()) {
          this.gameCompleted = true;
        }
      }
    }

    public disableDrag() {
      this.timerCompleted = true;
    }

    public allowDrop(event): void {
      event.preventDefault();
      event.target.style.opacity = 1;
    }

    public getCompletionStatus(): boolean {
      for (let index: number = 0; index < this.position.length; index++) {
        const current = this.position[index], next = this.position[index + 1];
        if (current > next) { return false; }
      }
      return true;
    }
    public ngOnDestroy() {
      this.subscription.unsubscribe();
    }

  }

  class ImageBox {
    x_pos: string;
    y_pos: string;
    index: number;
  }
