import { Entity, OptionalProps, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 as uuidV4 } from 'uuid';

@Entity({ tableName: 'user' })
export class User {
    [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt';

    @PrimaryKey()
    id: string = uuidV4();

    @Property()
    name!: string;

    @Property()
    surname!: string;

    @Property()
    orgName!: string;

    @Property()
    email!: string;

    @Property()
    orgAddress!: string;

    @Property()
    orgCountry!: string;

    @Property()
    manufacturingSector!: [string];

    @Property()
    orgSize!: string;

    @Property()
    profitOperation!: string;

    @Property()
    ownership!: number;

    @Property()
    geoScope!: string;

    @Property()
    participantHash!: string;

    @Property()
    participantUrl!: string;

    @Property({ type: 'timestamptz' })
    createdAt: Date = new Date();

    @Property({ type: 'timestamptz', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
