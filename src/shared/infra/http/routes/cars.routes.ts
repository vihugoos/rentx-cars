import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload-file";
import { CreateCarSpecificationsController } from "@modules/cars/use-cases/car/create-car-specifications/CreateCarSpecificationsController";
import { CreateCarController } from "@modules/cars/use-cases/car/create-car/CreateCarController";
import { ListAllCarsController } from "@modules/cars/use-cases/car/list-all-cars/ListAllCarsController";
import { ListAvailableCarsController } from "@modules/cars/use-cases/car/list-available-cars/ListAvailableCarsController";
import { ListCarImagesController } from "@modules/cars/use-cases/car/list-car-images/ListCarImagesController";
import { UploadCarImagesController } from "@modules/cars/use-cases/car/upload-car-images/UploadCarImagesController";
import { ensureAdmin } from "@shared/infra/http/middlewares/ensureAdmin";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const carsRoutes = Router();

const upload = multer(uploadConfig);

// Route to create a new car
carsRoutes.post(
    "/",
    ensureAuthenticated,
    ensureAdmin,
    new CreateCarController().handle
);

// Route to return all available cars
carsRoutes.get("/available", new ListAvailableCarsController().handle);

// Route to list all cars
carsRoutes.get(
    "/all",
    ensureAuthenticated,
    ensureAdmin,
    new ListAllCarsController().handle
);

// Route to create a new specification to the car
carsRoutes.post(
    "/specifications/:car_id",
    ensureAuthenticated,
    ensureAdmin,
    new CreateCarSpecificationsController().handle
);

// Routes to create images to cars
carsRoutes.post(
    "/images/:car_id",
    ensureAuthenticated,
    ensureAdmin,
    upload.array("images"),
    new UploadCarImagesController().handle
);

// Route to list car images
carsRoutes.get("/images/:car_id", new ListCarImagesController().handle);

export { carsRoutes };
