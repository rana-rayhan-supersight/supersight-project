import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Organization } from "./OrganizationEntity";
import { DeviceLocation } from "./DeviceLocationEntity";

@Entity({ name: "areas" })
export class AreaEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Organization, (organization) => organization.areas)
  organization: Organization;

  @OneToMany(() => DeviceLocation, (deviceL) => deviceL.area)
  deviceLocation: DeviceLocation[];
}
