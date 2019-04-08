import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { timer, Subscription } from 'rxjs';
/**
 * puzzle component
 */
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
  public position: Array<number> = [];
  public timerCompleted: boolean; // from countdown component
  public gameCompleted: boolean;
  public showOriginalImage: boolean = true;
  private subscription: Subscription;
  public showDown: number = 3;

  constructor(private changeDetector: ChangeDetectorRef) {

  }

  /**
   * Angular life cycle method
   */
  public ngOnInit(): void {
    this.initializeGame();
    this.breakImageParts();
    this.shuffleImages(this.Image);

    this.subscription = timer(1000, 1000).subscribe((value: number) => {
      this.showDown--;
      if (value === 3) {
        this.showOriginalImage = false;
        this.subscription.unsubscribe();

      }
      this.changeDetector.detectChanges();
    });

  }

  /**
   * creates the grids and boxes to display
   */
  public initializeGame(): void {

    this.gridsize = Number(3);
    this.boxSize = 100 / (this.gridsize - 1);
    this.totalBoxes = this.gridsize * this.gridsize;
  }
  /**
   * Breaks the image into defined parts
   */
  public breakImageParts(): void {
    for (let index: number = 0; index < this.totalBoxes; index++) {
      const x: string = (this.boxSize * (index % this.gridsize)) + '%';
      const y: string = (this.boxSize * Math.floor(index / this.gridsize)) + '%';
      const image: ImageBox = new ImageBox();
      image.x_pos = x;
      image.y_pos = y;
      image.index = index;
      this.Image.push(image);
    }
    this.boxSize = this.imageSize / this.gridsize;
  }

  /**
   * Randomize the images order keeping the sequence in memory
   * @param imageParts sequence of images
   */
  public shuffleImages(imageParts: Array<ImageBox>): void {
    for (let index: number = imageParts.length - 1; index > 0; index--) {
      const temp: number = Math.floor(Math.random() * (index + 1));
      [imageParts[index], imageParts[temp]] = [imageParts[temp], imageParts[index]]; // swapping
    }
    imageParts.forEach((image: ImageBox) => {
      this.position.push(image.index);
    });

  }

  /**
   * Drag start event
   * @param event Drag event
   */
  public onDragStart(event: any): void {
    if (!(this.timerCompleted || this.gameCompleted)) {
      event.dataTransfer.setData('data', event.target.id);
    }
  }

  /**
   * Drop event
   * @param event drag event
   */
  public onDrop(event: any): void {
    if (!(this.timerCompleted || this.gameCompleted)) {
      const origin = event.dataTransfer.getData('data');
      const destination = event.target.id;


      const originElement = document.getElementById(origin);
      const destinationElement = document.getElementById(destination);

      const originStyle = originElement.style.cssText;
      const destinationStyle = event.target.style.cssText;


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

      if (this.getCompletionStatus()) {
        this.gameCompleted = true;
      }
    }
  }

  /**
   * Disable drag and drop
   */
  public disableDrag(): void {
    this.timerCompleted = true;
  }

  /**
   * Allow Drop other wise drop event won't work
   * @param event drop event
   */
  public allowDrop(event): void {
    event.preventDefault();
    event.target.style.opacity = 1;
  }

  /**
   * Calculates the positions of images is in sorted order or not
   */
  public getCompletionStatus(): boolean {
    for (let index: number = 0; index < this.position.length; index++) {
      const current = this.position[index];
      const next = this.position[index + 1];
      if (current > next) { 
        return false;
      }
    }
    return true;
  }

  /**
   * Life cycle event
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

/**
 * Generic Image box class
 */
class ImageBox {
  x_pos: string;
  y_pos: string;
  index: number;
}
