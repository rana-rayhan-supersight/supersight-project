import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import { UserRole } from "./UserRole";
import { Organization } from "./OrganizationEntity";
import { Technician } from "./TechnicianEntity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  email: string;
  @Column()
  password: string;

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
      await bcrypt.hash(this.password, 10);
    }
  }
}
