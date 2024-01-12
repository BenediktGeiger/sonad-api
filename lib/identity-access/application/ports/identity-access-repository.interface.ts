import { User } from '@lib/identity-access/domain/user';

import { UUID } from 'crypto';

export default interface IdentityAccessRepository {
	saveUser(user: User): Promise<{ id: UUID }>;
	getUser(userId: UUID): Promise<User | null>;
}
