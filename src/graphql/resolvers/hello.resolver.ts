import { Resolver, Query, UseMiddleware } from 'type-graphql'
import { Authenticated } from '../../middleware/Authenticated'

@Resolver()
export class HelloWorld {
	@Query(() => String)
	hello() {
		return 'Hello world'
	}

	@Query(() => String)
	@UseMiddleware(Authenticated)
	authenticated() {
		return 'You made it.'
	}
}
