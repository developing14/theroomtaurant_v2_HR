import { Test, TestingModule } from '@nestjs/testing';
import { ReviewFilterService } from './reviewFilter.service';

describe('ReviewFilterService', () => {
  let service: ReviewFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewFilterService],
    }).compile();

    service = module.get<ReviewFilterService>(ReviewFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
