import { AbstractEntity } from 'nestjs-dev-utilities';
import { Column, Entity } from 'typeorm';

@Entity('public_holiday')
export class PublicHolidayEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true })
  holiday_date: string;
}
