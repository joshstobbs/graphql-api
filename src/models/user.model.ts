import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BeforeInsert,
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import bcrypt from 'bcryptjs'

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn()
	id: number

	@Field()
	@Column()
	name: string

	@Field()
	@Column()
	email: string

	@Column()
	password: string

	@Column('int', { default: 0 })
	tokenVersion: number

	@BeforeInsert()
	async hashPassword() {
		this.password = await bcrypt.hash(this.password, 12)
	}
}
