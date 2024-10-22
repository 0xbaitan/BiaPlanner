import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhoneEntryEntity } from './phone-entry.entity';
import { Repository } from 'typeorm';
import { PhoneEntry } from '@biaplanner/shared';

@Injectable()
export class PhoneEntryService {
  constructor(
    @InjectRepository(PhoneEntryEntity)
    private readonly phoneEntryRepository: Repository<PhoneEntry>,
  ) {}

  public async getAllPhoneEntries(): Promise<PhoneEntry[]> {
    const allPhoneEntries = await this.phoneEntryRepository.find({
      relations: ['user'],
    });
    return allPhoneEntries;
  }

  public async addPhoneEntry(entry: Partial<PhoneEntry>): Promise<PhoneEntry> {
    const addedPhoneEntry = await this.phoneEntryRepository.save(entry);
    return addedPhoneEntry;
  }

  public async deletePhoneEntry(id: number): Promise<void> {
    await this.phoneEntryRepository.delete(id);
  }
}
