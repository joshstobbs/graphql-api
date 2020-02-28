import { MiddlewareFn } from 'type-graphql'
import { Context } from '../@types/Context'
import { verify } from 'jsonwebtoken'

export const Authenticated: MiddlewareFn<Context> = ({ context }, next) => {
	const authorization = context.req.headers.authorization

	if (!authorization) {
		throw new Error('Not authenticated')
	}

	try {
		const token = authorization.split(' ')[1]
		const payload: any = verify(token, process.env.JWT_SECRET!)

		context.payload = payload as any
	} catch (error) {
		console.log(error)

		throw new Error('Not Authenticated')
	}

	return next()
}
