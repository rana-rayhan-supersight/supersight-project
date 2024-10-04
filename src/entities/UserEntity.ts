import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import bcrypt from "bcryptjs";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;
  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async bcryptPass() {
    if (this.password) {
      await bcrypt.hash(this.password, 10);
    }
  }
}
