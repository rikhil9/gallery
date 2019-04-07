import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'puzzle',
    templateUrl: './puzzle.component.html',
    styleUrls: ['./puzzle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class PuzzleComponent implements OnInit {
    public imageUrl: string = '../assets/berlin.jpg';
    public imageSize: number = 700;
    public gridsize: number;
    public boxSize: number;
    public totalBoxes: number;
    public Image: any[] = [];
    public indexes: Array<number> = [];
    public position: Array<number> = [];
    public timerCompleted: boolean;
    public gameCompleted: boolean;

    constructor() {

    }
    public ngOnInit() {
      this.initializeGame();
      this.breakImageParts(); 
      this.Image = this.randomize(this.Image); 
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

  }

  class ImageBox {
    x_pos: string;
    y_pos: string;
    index: number;
  }
