import { Entity, OptionalProps, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 as uuidV4 } from 'uuid';

@Entity({ tableName: 'metadata' })
export class Metadata {
    [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt';

    @PrimaryKey()
    id: string = uuidV4();

    @Property()
    assetId!: string;

    @Property({ nullable: true })
    version!: string;

    @Property({ type: 'text' })
    dataType!: 'acquired' | 'myData';

    @Property({ nullable: true })
    title!: string;

    @Property({ nullable: true })
    description!: string;

    @Property({ nullable: true })
    keywords!: string[];

    @Property({ nullable: true })
    language!: string;

    @Property({ nullable: true })
    publisher!: string;

    @Property({ nullable: true })
    published!: boolean;

    @Property({ nullable: true })
    user!: string;

    @Property({type: 'float'})
    filesize!: number;

    @Property({ nullable: true })
    domain!: string;

    @Property({ nullable: true })
    acquiredOn!: Date;

    @Property({ nullable: true })
    license!: string;

    // @Property({ nullable: true })
    // price!: string;

    @Property({ nullable: true })
    contractTerms!: string;

    @Property({ nullable: true })
    fileExt!: string;

    @Property({ type: 'timestamptz' })
    createdAt: Date = new Date();

    @Property({ type: 'timestamptz', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
