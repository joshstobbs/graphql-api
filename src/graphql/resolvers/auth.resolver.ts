import { Arg, Ctx, Mutation, Query, Int } from 'type-graphql'
import { compare } from 'bcryptjs'
import { AuthInput } from '../inputs/authentication.input'
import { Context } from '../../@types/Context'
import { User } from '../../models/user.model'
import { LoginResponse } from '../types/Authentication'
import {
	createAccessToken,
	createRefreshToken,
	sendRefreshToken,
} from '../../auth'
import { verify } from 'jsonwebtoken'
import { getConnection } from 'typeorm'

export class AuthResolver {
	@Mutation(() => Boolean)
	async register(@Arg('input') { email, password }: AuthInput) {
		try {
			await User.insert({ email, password })
		} catch (error) {
			console.log(error)

			return false
		}

		return true
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg('input') { email, password }: AuthInput,
		@Ctx() { res }: Context,
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } })

		if (!user) {
			throw new Error('User not found.')
		}

		const valid = await compare(password, user.password)

		if (!valid) {
			throw new Error('Password is invalid')
		}

		sendRefreshToken(res, createRefreshToken(user))

		return {
			accessToken: createAccessToken(user),
			user,
		}
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { res }: Context) {
		sendRefreshToken(res, '')

		return true
	}

	@Mutation(() => Boolean)
	async revokeRefreshToken(@Arg('userId', () => Int) userId: number) {
		await getConnection()
			.getRepository(User)
			.increment({ id: userId }, 'tokenVersion', 1)

		return true
	}

	@Query(() => User, { nullable: true })
	me(@Ctx() context: Context) {
		const authorization = context.req.headers['authorization']

		if (!authorization) {
			return null
		}

		try {
			const token = authorization.split(' ')[1]
			const payload: any = verify(token, process.env.JWT_SECRET!)

			return User.findOne(payload.userId)
		} catch (error) {
			console.log(error)

			return null
		}
	}
}
