import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { Organization } from "./OrganizationEntity";
import { Technician } from "./TechnicianEntity";
import { UserEntity } from "./UserEntity";
import { DeviceLocation } from "./DeviceLocationEntity";

@Entity({ name: "devices" })
export class Device {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  model: string;

  @Column({ default: false })
  isActive: boolean;

  // Activated by Admin
  @ManyToOne(() => UserEntity, { nullable: true })
  activatedByAdmin: UserEntity;

  // Activated by Technician
  @ManyToOne(() => Technician, { nullable: true })
  activatedByTechnician: Technician;

  // @ManyToOne(() => Organization, (organization) => organization.devices)
  // organization: Organization;

  @ManyToOne(() => Technician, (technician) => technician.device)
  technician: Technician;

  @OneToOne(() => DeviceLocation, (location) => location.device)
  deviceLocation: DeviceLocation;
}
