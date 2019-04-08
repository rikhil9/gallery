import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownComponent} from './countdown.component';

/**
 * Countdown module
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CountdownComponent
  ],
  exports: [
    CountdownComponent
  ]
})
export class CountdowneModule {}
