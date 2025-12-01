import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Account {

    constructor(account?: Account){
         if (account){
            this.email = account.email
            this.password = account.password
            this.isDeleted = account.isDeleted
            }

    }

    @Prop({required: true, unique: true})
    email: string


    @Prop({required: true})
    password: string

    @Prop({default: false})
    isDeleted: boolean

    @Prop({default: Date.now})
    lastUpdate: Date
}

export const AccountSchema = SchemaFactory.createForClass(Account);

