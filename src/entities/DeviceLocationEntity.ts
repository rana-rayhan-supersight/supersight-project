import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { UserEntity } from "./UserEntity";
import { Technician } from "./TechnicianEntity";
import { AreaEntity } from "./AreaEntity";
import { Device } from "./DeviceEntity";

@Entity({ name: "deviceLocations" })
export class DeviceLocation {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  deviceId: string;

  @Column()
  locationPoint: string;

  @Column({ default: false })
  isActive: boolean;

  // Activated by Admin
  @ManyToOne(() => UserEntity, { nullable: true })
  activatedByAdmin: UserEntity;

  // Activated by Technician
  @ManyToOne(() => Technician, { nullable: true })
  activatedByTechnician: Technician;

  //one areas
  @ManyToOne(() => AreaEntity, (area) => area.deviceLocation)
  area: AreaEntity;

  @OneToOne(() => Device, (device) => device.deviceLocation)
  device: Device;
}
