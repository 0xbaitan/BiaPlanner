import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '@biaplanner/shared';
@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 0 })
  age: number;
}
