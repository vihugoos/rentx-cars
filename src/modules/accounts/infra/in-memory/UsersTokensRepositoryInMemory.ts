import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";

import { UserTokens } from "../typeorm/entities/UserTokens";

export class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
    usersTokens: UserTokens[] = [];

    async create({
        user_id,
        refresh_token,
        expires_date,
    }: ICreateUserTokenDTO): Promise<UserTokens> {
        const userToken = new UserTokens();

        Object.assign(userToken, {
            user_id,
            refresh_token,
            expires_date,
        });

        this.usersTokens.push(userToken);

        return userToken;
    }

    async findByUserIdAndRefreshToken(
        user_id: string,
        refresh_token: string
    ): Promise<UserTokens> {
        const userToken = this.usersTokens.find(
            (ut) => ut.user_id === user_id && ut.refresh_token === refresh_token
        );

        return userToken;
    }

    async deleteById(id: string): Promise<void> {
        const indexUserToken = this.usersTokens.findIndex((ut) => ut.id === id);

        this.usersTokens.splice(indexUserToken, 1);
    }

    async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
        const userToken = this.usersTokens.find(
            (ut) => ut.refresh_token === refresh_token
        );

        return userToken;
    }
}
