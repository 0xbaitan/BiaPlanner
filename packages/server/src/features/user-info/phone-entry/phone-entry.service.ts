import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhoneEntryEntity } from './phone-entry.entity';
import { Repository } from 'typeorm';
import { IPhoneEntry } from '@biaplanner/shared';

@Injectable()
export class PhoneEntryService {
  constructor(
    @InjectRepository(PhoneEntryEntity)
    private readonly phoneEntryRepository: Repository<IPhoneEntry>,
  ) {}

  public async findAllPhoneEntries(): Promise<IPhoneEntry[]> {
    const allPhoneEntries = await this.phoneEntryRepository.find({
      relations: ['user'],
    });
    return allPhoneEntries;
  }

  public async createPhoneEntry(
    entry: Partial<IPhoneEntry>,
  ): Promise<IPhoneEntry> {
    const addedPhoneEntry = await this.phoneEntryRepository.save(entry);
    return addedPhoneEntry;
  }

  public async deletePhoneEntry(id: string): Promise<void> {
    await this.phoneEntryRepository.delete(id);
  }
}
