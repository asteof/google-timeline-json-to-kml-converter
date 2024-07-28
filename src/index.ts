import { createJsonChunks } from './CreateChunks';
import { createKMLFiles } from './CreateKML';

const params = [2015, 2024]
createJsonChunks(...params);
createKMLFiles(...params);