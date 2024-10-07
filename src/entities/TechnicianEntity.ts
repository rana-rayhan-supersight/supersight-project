import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./UserEntity";
import { Device } from "./DeviceEntity";

@Entity({ name: "technicians" })
export class Technician {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  socialSecurity: string;

  @Column({ default: false })
  isActive: boolean;

  // activatedBy admin
  @ManyToOne(() => UserEntity, { nullable: true })
  activatedBy: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.technicians)
  user: UserEntity;

  @ManyToOne(() => Device, (device) => device.technician)
  device: Device;
}
