import { Module } from '@nestjs/common';
import { ReviewFilterController } from './reviewFilter.controller';
import { ReviewFilterService } from './reviewFilter.service';

@Module({
  controllers: [ReviewFilterController],
  providers: [ReviewFilterService]
})
export class ReviewFilterModule {}
