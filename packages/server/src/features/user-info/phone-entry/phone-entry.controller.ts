import { IPhoneEntry } from '@biaplanner/shared';
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
  public async findPhoneEntries(): Promise<IPhoneEntry[]> {
    return this.phoneEntryService.findAllPhoneEntries();
  }

  @Post()
  public async createPhoneEntry(
    @Body() phoneEntry: IPhoneEntry,
  ): Promise<IPhoneEntry> {
    return this.phoneEntryService.createPhoneEntry(phoneEntry);
  }

  @Delete('/:id')
  public async deletePhoneEntry(@Param('id') id: string): Promise<void> {
    return this.phoneEntryService.deletePhoneEntry(id);
  }
}
