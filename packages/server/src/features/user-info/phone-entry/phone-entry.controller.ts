import { PhoneEntry } from '@biaplanner/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { PhoneEntryService } from './phone-entry.service';

@Controller('/phone-entries')
export class PhoneEntryController {
  constructor(
    @Inject(PhoneEntryService)
    private readonly phoneEntryService: PhoneEntryService,
  ) {}

  @Get()
  public async getPhoneEntries(): Promise<PhoneEntry[]> {
    return this.phoneEntryService.getAllPhoneEntries();
  }

  @Post()
  public async addPhoneEntry(
    @Body() phoneEntry: PhoneEntry,
  ): Promise<PhoneEntry> {
    return this.phoneEntryService.addPhoneEntry(phoneEntry);
  }

  @Delete('/:id')
  public async deletePhoneEntry(@Param('id') id: number): Promise<void> {
    return this.phoneEntryService.deletePhoneEntry(id);
  }
}
