import { Entity, OptionalProps, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 as uuidV4 } from 'uuid';

@Entity({ tableName: 'transactions' })
export class Transactions {
    [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt';

    @PrimaryKey()
    id: string = uuidV4();

    @Property({ nullable: true })
    version!: string;

    @Property()
    seller!: string;

    @Property()
    assetTitle!:string;

    @Property()
    assetId!: string;

    @Property({nullable: true})
    price!: number;

    @Property()
    sector!: string;

    @Property()
    type!: string;

    @Property({ nullable: true })
    transactionId!: string;

    @Property({ type: 'timestamptz' })
    createdAt: Date = new Date();

    @Property({ type: 'timestamptz', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
