import { Query, Arg, Int, Mutation } from 'type-graphql'
import { User } from '../../models/user.model'
import { UserInput, UserUpdateInput } from '../inputs/user.input'

export class UserResolver {
	@Query(() => User)
	async user(@Arg('id', () => Int) id: number): Promise<User | undefined> {
		return User.findOne(id)
	}

	@Query(() => [User])
	async users(): Promise<User[]> {
		return User.find()
	}

	@Mutation(() => User)
	async createUser(
		@Arg('input', () => UserInput) input: UserInput,
	): Promise<User> {
		const user = await User.create(input).save()

		return user
	}

	@Mutation(() => User)
	async updateUser(
		@Arg('id', () => Int) id: number,
		@Arg('input', () => UserUpdateInput) input: UserUpdateInput,
	): Promise<User | undefined> {
		const response = await User.update({ id }, input)

		console.log(response)

		return User.findOne(id)
	}
}
