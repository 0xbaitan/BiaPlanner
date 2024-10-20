import { PhoneEntry } from '@biaplanner/shared';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { PhoneEntryService } from './phone-entry.service';

@Controller('/phone-entries')
export class PhoneEntryController {

    constructor(@Inject(PhoneEntryService) private readonly phoneEntryService: PhoneEntryService) {}

    @Get()
    public async getPhoneEntries() {
        return 'Hello world'
    }

    @Post() 
    public async addPhoneEntry(@Body() phoneEntry: PhoneEntry): Promise<PhoneEntry> {
        return this.phoneEntryService.addPhoneEntry(phoneEntry)
    }

}
