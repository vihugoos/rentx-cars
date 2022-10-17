import { ICreateSpecificationDTO } from "@modules/cars/dtos/ICreateSpecificationDTO";
import { ISpecification } from "@modules/cars/entities/ISpecification";

interface ISpecificationsRepository {
    create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<ISpecification>;
    findByName(name: string): Promise<ISpecification>;
    findByIds(ids: string[]): Promise<ISpecification[]>;
}

export { ISpecificationsRepository, ICreateSpecificationDTO };
