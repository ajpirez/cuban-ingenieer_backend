import { Base } from 'src/base/base.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserRol } from '../enums/user.rol';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ nullable: false, default: UserRol.User })
  role: UserRol;

  @ManyToOne(() => User, (user) => user.created_by)
  created_by: User;

  @ManyToOne(() => User, (user) => user.deleted_by)
  deleted_by: User;

  @ManyToOne(() => User, (user) => user.updated_by)
  updated_by: User;

  @ManyToOne(() => User, (user) => user.restored_by)
  restored_by: User;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
