import { Part } from '../models/part.schema';
import { WithId } from './with-id.types';

export type PartsListGetDto = Pick<Part, 'name' | 'upgradeLevels'> & WithId;
