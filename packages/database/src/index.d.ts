import '@lumina/config';
import { DynamicModule } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export type DatabaseModuleOptions = Partial<TypeOrmModuleOptions>;
export declare class DatabaseModule {
    static forRoot(options?: DatabaseModuleOptions): DynamicModule;
}
