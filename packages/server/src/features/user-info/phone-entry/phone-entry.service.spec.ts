import { Test, TestingModule } from '@nestjs/testing';
import { PhoneEntryService } from './phone-entry.service';

describe('PhoneEntryService', () => {
  let service: PhoneEntryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhoneEntryService],
    }).compile();

    service = module.get<PhoneEntryService>(PhoneEntryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
