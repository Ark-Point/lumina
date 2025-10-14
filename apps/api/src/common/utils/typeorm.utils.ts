import { DataSourceOptions } from 'typeorm';

export function isValidDatabaseType(
  type: string | undefined,
): type is DataSourceOptions['type'] {
  if (typeof type !== 'string') {
    return false;
  }

  const validTypes: DataSourceOptions['type'][] = [
    'mysql',
    'mariadb',
    'postgres',
    'sqlite',
    'oracle',
    'cordova',
    'mongodb',
  ];
  return validTypes.includes(type as DataSourceOptions['type']);
}
