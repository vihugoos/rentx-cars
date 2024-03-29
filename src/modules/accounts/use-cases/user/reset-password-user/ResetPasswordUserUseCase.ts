import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/date-provider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    token: string;
    password: string;
}

@injectable()
export class ResetPasswordUserUseCase {
    constructor(
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,

        @inject("DateProvider")
        private dateProvider: IDateProvider,

        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.usersTokensRepository.findByRefreshToken(
            token
        );

        if (!userToken) {
            throw new AppError("Token does not exists!");
        }

        const tokenIsExpired = this.dateProvider.compareIfBefore(
            userToken.expires_date,
            this.dateProvider.dateNow()
        );

        if (tokenIsExpired) {
            throw new AppError("Token is expired!");
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        const newPassword = await hash(password, 8);

        await this.usersRepository.updatedUserPassword(user.id, newPassword);

        await this.usersTokensRepository.deleteById(userToken.id);
    }
}
