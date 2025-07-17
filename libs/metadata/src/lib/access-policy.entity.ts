import { Entity, OptionalProps, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 as uuidV4 } from 'uuid';

@Entity({ tableName: 'accessPolicy' })
export class AccessPolicy {
    [OptionalProps]?: 'id' | 'createdAt' | 'updatedAt';

    @PrimaryKey()
    id: string = uuidV4();

    @Property({ nullable: true })
    title!: string;

    @Property({ nullable: true })
    description!: string;

    @Property({ nullable: true })
    default!: boolean;

    @Property({ nullable: true })
    scopes!: string[];

    @Property({ nullable: true })
    groups!: string[];

    @Property({ nullable: true })
    countries!: string[];

    @Property({ nullable: true })
    sizes!: string[];

    @Property({ nullable: true })
    domains!: string[];

    @Property({ nullable: true })
    categories!: string[];

    @Property({ nullable: true })
    trustLevel!: number;

    @Property({ type: 'timestamptz' })
    createdAt: Date = new Date();

    @Property({ type: 'timestamptz', onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
