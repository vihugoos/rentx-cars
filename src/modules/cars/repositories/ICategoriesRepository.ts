import { ICreateCategoryDTO } from "@modules/cars/dtos/ICreateCategoryDTO";
import { ICategory } from "@modules/cars/entities/ICategory";

export interface ICategoriesRepository {
    create({ name, description }: ICreateCategoryDTO): Promise<ICategory>;
    list(): Promise<ICategory[]>;
    findByName(name: string): Promise<ICategory>;
}
