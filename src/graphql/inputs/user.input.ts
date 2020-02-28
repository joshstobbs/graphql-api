import { InputType, Field } from 'type-graphql'

@InputType()
export class UserInput {
	@Field()
	name: string

	@Field()
	email: string

	@Field()
	password: string
}

@InputType()
export class UserUpdateInput {
	@Field(() => String, { nullable: true })
	name: string

	@Field(() => String, { nullable: true })
	email: string

	@Field(() => String, { nullable: true })
	password: string
}
