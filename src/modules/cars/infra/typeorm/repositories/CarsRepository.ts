import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";

class CarsRepository implements ICarsRepository {
    private repository: Repository<Car>;

    constructor() {
        this.repository = getRepository(Car);
    }

    async create({
        name,
        description,
        daily_rate,
        license_plate,
        fine_amount,
        brand,
        category_id,
    }: ICreateCarDTO): Promise<Car> {
        const car = this.repository.create({
            name,
            description,
            daily_rate,
            license_plate,
            fine_amount,
            brand,
            category_id,
        });

        await this.repository.save(car);

        return car;
    }

    async findById(id: string): Promise<Car> {
        return this.repository.findOne(id);
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        return this.repository.findOne({ license_plate });
    }

    async findAllAvailable(type_filter: string, value: string): Promise<Car[]> {
        const carsQuery = this.repository
            .createQueryBuilder("cars")
            .where("available = :available", { available: true });

        if (type_filter) {
            if (type_filter === "name") {
                carsQuery.andWhere("cars.name = :name", { name: value });
            }

            if (type_filter === "brand") {
                carsQuery.andWhere("cars.brand = :brand", { brand: value });
            }

            if (type_filter === "category_id") {
                carsQuery.andWhere("cars.category_id = :category_id", {
                    category_id: value,
                });
            }
        }

        const carsAvailable = await carsQuery.getMany();

        return carsAvailable;
    }

    async createCarSpecifications(car: Car): Promise<Car> {
        return this.repository.save(car);
    }
}

export { CarsRepository };