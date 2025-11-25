import { Test, TestingModule } from '@nestjs/testing';
import { ReviewFilterController } from './reviewFilter.controller';

describe('ReviewFilterController', () => {
  let controller: ReviewFilterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewFilterController],
    }).compile();

    controller = module.get<ReviewFilterController>(ReviewFilterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
