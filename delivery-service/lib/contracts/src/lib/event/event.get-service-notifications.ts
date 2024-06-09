import { IServiceNotification, UserRole } from "@myhome/interfaces";
import { IsNumber, Validate } from "class-validator";
import { IsValidEnumValue } from '../../../enum.validator';
import { MetaRequest } from "../../../meta.validator";

export namespace EventGetServiceNotifications {
    export const topic = 'event.get-service-notifications.query';

    export class Request extends MetaRequest {
        @IsNumber({}, { message: "Id пользователя должно быть числом" })
        userId!: number;

        @Validate(IsValidEnumValue, [UserRole])
        userRole!: UserRole;
    }

    export class Response {
        notifications!: IServiceNotification[];
    }
}