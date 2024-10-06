import { Entity, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Base } from '../../base/base.entity';

export enum FileStatus {
  UPLOADED = 'uploaded',
  COMPRESSED = 'compressed',
}

@Entity('files')
export class File extends Base {
  @ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  file_name: string;

  @Column()
  file_size: number;

  @Column({
    type: 'enum',
    enum: FileStatus,
    default: FileStatus.UPLOADED,
  })
  file_status: FileStatus;

  @Column({ nullable: true })
  original_file_path: string;

  @Column({ nullable: true })
  compressed_file_path: string;

  @CreateDateColumn()
  uploaded_at: Date;

  @Column({ nullable: true })
  compressed_at: Date;
}
