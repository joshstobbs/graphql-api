import { User } from '../models/user.model'
import { sign, verify } from 'jsonwebtoken'
import { Request, Response } from 'express'

export const createAccessToken = (user: User) => {
	return sign({ userId: user.id }, process.env.JWT_SECRET!, {
		expiresIn: '7d',
	})
}

export const createRefreshToken = (user: User) => {
	return sign(
		{ userId: user.id, tokenVersion: user.tokenVersion },
		process.env.REFRESH_SECRET!,
		{
			expiresIn: '30d',
		},
	)
}

export const sendRefreshToken = (res: Response, token: string) => {
	res.cookie('jid', token, {
		httpOnly: true,
		path: '/refresh_token',
	})
}

export const refreshRoute = async (req: Request, res: Response) => {
	const token = req.cookies.jid

	if (!token) {
		return res.send({ ok: false, accessToken: '' })
	}

	let payload: any = null

	try {
		payload = verify(token, process.env.REFRESH_SECRET!)
	} catch (error) {
		console.log(error)

		return res.send({ ok: false, accessToken: '' })
	}

	const user = await User.findOne({ id: payload.userId })

	if (!user) {
		return res.send({ ok: false, accessToken: '' })
	}

	if (user.tokenVersion !== payload.tokenVersion) {
		return res.send({ ok: false, accessToken: '' })
	}

	sendRefreshToken(res, createRefreshToken(user))

	return res.send({ ok: true, accessToken: createAccessToken(user) })
}
