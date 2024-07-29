import { createJsonChunks } from './CreateChunks';
import { createKMLFiles } from './CreateKML';
import { initialSetup } from './InitialSetup';

initialSetup();

const params = [2015, 2024]
createJsonChunks(...params);
createKMLFiles(...params);