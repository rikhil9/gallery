import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { PuzzleComponent} from './puzzle.component';
import { CountdowneModule } from '../countdown/countdown.module';

@NgModule({
  imports: [
    CommonModule,
    CountdowneModule
  ],
  declarations: [
    PuzzleComponent,
  ],
  exports: [
    PuzzleComponent,
  ]
})
export class PuzzleModule {}