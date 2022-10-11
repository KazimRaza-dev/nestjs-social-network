import { forwardRef, Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { EventsGateway } from "./events.gateway";


@Module({
    imports: [forwardRef(() => UserModule)],
    providers: [EventsGateway],
    controllers: [],
    exports: [EventsGateway]
})
export class EventsModule { }