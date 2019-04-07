import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { PuzzleComponent} from './puzzle.component';
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    PuzzleComponent
  ],
  exports: [
    PuzzleComponent
  ]
})
export class PuzzleModule {}