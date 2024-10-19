import { Test, TestingModule } from '@nestjs/testing';
import { PhoneEntryController } from './phone-entry.controller';

describe('PhoneEntryController', () => {
  let controller: PhoneEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhoneEntryController],
    }).compile();

    controller = module.get<PhoneEntryController>(PhoneEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
