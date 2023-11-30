import { DataSource } from 'typeorm';
import { dataSourceOptions } from './src/configs/typeorm-datasource.config';

export default new DataSource(dataSourceOptions);
