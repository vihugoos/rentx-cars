import { inject, injectable } from "tsyringe";

import { ICategory } from "@modules/cars/entities/ICategory";
import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    name: string;
    description: string;
}

@injectable()
export class CreateCategoryUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository
    ) {}

    async execute({ name, description }: IRequest): Promise<ICategory> {
        const categoryAlreadyExists =
            await this.categoriesRepository.findByName(name);

        if (categoryAlreadyExists) {
            throw new AppError("Category already exists!");
        }

        const category = this.categoriesRepository.create({
            name,
            description,
        });

        return category;
    }
}
