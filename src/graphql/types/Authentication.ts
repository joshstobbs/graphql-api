import { ObjectType, Field } from 'type-graphql'
import { User } from '../../models/user.model'

@ObjectType()
export class LoginResponse {
	@Field()
	accessToken: string

	@Field(() => User)
	user: User
}
