import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";

import createConnection from "../index";

async function createAdmin() {
    const connection = await createConnection();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
        `INSERT INTO USERS(id, name, email, password, driver_license, "admin", created_at)
            values('${id}', 'admin', 'admin@rentx.com', '${password}', 'XXX-XXX', true, 'now()')
        `
    );

    await connection.close();
}

createAdmin().then(() => console.log("[Seed] Admin created successfully."));
