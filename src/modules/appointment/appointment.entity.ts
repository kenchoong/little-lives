import { AbstractEntity } from 'nestjs-dev-utilities';
import { Column, Entity } from 'typeorm';

@Entity('appointment')
export class AppointmentEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: false })
  date: string;

  @Column({ type: 'time', nullable: false })
  time: string;
}
