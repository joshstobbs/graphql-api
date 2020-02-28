import { buildSchema } from 'type-graphql'
import resolvers from './resolvers'

export default buildSchema({
	resolvers,
})
