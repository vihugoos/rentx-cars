import { SES } from "aws-sdk";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider } from "../IMailProvider";

@injectable()
export class SESMailProvider implements IMailProvider {
    private client: Transporter;

    constructor() {
        this.client = nodemailer.createTransport({
            SES: new SES({
                apiVersion: process.env.AWS_SES_API_VERSION,
                region: process.env.AWS_SES_REGION,
            }),
        });
    }

    async sendMail(
        to: string,
        subject: string,
        variables: unknown,
        path: string
    ): Promise<void> {
        const templateFileContent = fs.readFileSync(path).toString("utf-8");

        const templateParse = handlebars.compile(templateFileContent);

        const templateHTML = templateParse(variables);

        await this.client.sendMail({
            to,
            from: `Rentx <${process.env.AWS_SES_EMAIL}>`,
            subject,
            html: templateHTML,
        });
    }
}
