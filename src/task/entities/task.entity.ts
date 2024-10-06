import { Entity, Column, ManyToOne } from 'typeorm';
import { Base } from '../../base/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Task extends Base {
  @Column()
  title: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => User)
  created_by: User;

  @ManyToOne(() => User)
  deleted_by: User;

  @ManyToOne(() => User)
  updated_by: User;

  @ManyToOne(() => User)
  restored_by: User;
}
