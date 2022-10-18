import { getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    async create({
        name,
        password,
        email,
        driver_license,
    }: ICreateUserDTO): Promise<void> {
        const user = this.repository.create({
            name,
            password,
            email,
            driver_license,
        });

        await this.repository.save(user);
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOne({ email });

        return user;
    }

    async findById(id: string): Promise<User> {
        const user = await this.repository.findOne(id);

        return user;
    }

    async updateUserAvatar(id: string, avatar_file: string): Promise<void> {
        const user = await this.repository.findOne(id);

        user.avatar = avatar_file;

        await this.repository.save(user);
    }
}

export { UsersRepository };
