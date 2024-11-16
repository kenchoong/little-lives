import { AbstractEntity } from 'nestjs-dev-utilities';
import { Column, Entity } from 'typeorm';

export type UnavailableHour = { from: string; to: string };

@Entity('configuration')
export class ConfigurationEntity extends AbstractEntity {
  // operation_day (0 - 6) Dayjs
  // Accepts numbers from 0 (Sunday) to 6 (Saturday). If the range is exceeded, it will bubble up to other weeks.
  // operation_day_name (Monday - Sunday)
  // operation_start_time (string 10:00)
  // operation_end_time (string 14:00)
  // unavailable_hours = [string] ["10:00"]

  @Column({ type: 'int', nullable: false })
  operation_day: number;

  @Column({ type: 'varchar', nullable: false })
  operation_day_name: string;

  @Column({ type: 'varchar', nullable: false })
  operation_start_time: string;

  @Column({ type: 'varchar', nullable: false })
  operation_end_time: string;

  @Column({ type: 'jsonb', nullable: true })
  unavailable_hours?: UnavailableHour[];
}
