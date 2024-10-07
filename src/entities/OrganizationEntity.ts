import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity";
import { Device } from "./DeviceEntity";
import { DeviceLocation } from "./DeviceLocationEntity";
import { AreaEntity } from "./AreaEntity";

@Entity({ name: "organizations" })
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  businessId: string;

  @Column({ default: false })
  isActive: boolean;

  // activatedBy admin
  @ManyToOne(() => UserEntity, { nullable: true })
  activatedByAdmin: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.organizations)
  user: UserEntity;

  //   @OneToMany(() => Device, (device) => device.organization)
  //   devices: Device[];

  // Many areas
  @OneToMany(() => AreaEntity, (area) => area.organization)
  areas: AreaEntity[];
}
