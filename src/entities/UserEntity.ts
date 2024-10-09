import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import { UserRole } from "./UserRole";
import { Organization } from "./OrganizationEntity";
import { Technician } from "./TechnicianEntity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  confirmationStatus: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Organization, (organization) => organization.user)
  organizations: Organization[];

  @OneToMany(() => Technician, (technician) => technician.user)
  technicians: Technician[];

  // hash password before insert and update
  @BeforeInsert()
  @BeforeUpdate()
  async bcryptPass() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
