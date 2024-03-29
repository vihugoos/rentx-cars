import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IRental } from "@modules/rentals/entities/IRental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/date-provider/IDateProvider";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
    user_id: string;
    car_id: string;
    expected_return_date: Date;
}
@injectable()
export class CreateRentalUseCase {
    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: IRentalsRepository,

        @inject("CarsRepository")
        private carsRepository: ICarsRepository,

        @inject("DateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({
        user_id,
        car_id,
        expected_return_date,
    }: IRequest): Promise<IRental> {
        const carExists = await this.carsRepository.findById(car_id);

        if (!carExists) {
            throw new AppError("Car does not exists!");
        }

        const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(
            car_id
        );

        if (carUnavailable) {
            throw new AppError("This car is already rented!");
        }

        const rentalOpenToUser =
            await this.rentalsRepository.findOpenRentalByUser(user_id);

        if (rentalOpenToUser) {
            throw new AppError("There's a rental in progress for user!");
        }

        this.validateExpectedReturnDate(expected_return_date);

        const rental = await this.rentalsRepository.create({
            user_id,
            car_id,
            expected_return_date,
        });

        await this.carsRepository.updateAvailable(car_id, false);

        return rental;
    }

    private validateExpectedReturnDate(expected_return_date: Date): void {
        const MINIMUM_HOUR = 24;

        const dateNow = this.dateProvider.dateNow();

        const diff = this.dateProvider.diffInHours(
            expected_return_date,
            dateNow
        );

        if (diff < MINIMUM_HOUR) {
            throw new AppError(
                `Expected return date less than ${MINIMUM_HOUR} hours!`
            );
        }
    }
}
