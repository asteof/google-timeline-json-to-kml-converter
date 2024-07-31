import { createJsonChunks } from './CreateChunks';
import { createKMLFiles } from './CreateKML';
import { initialSetup } from './InitialSetup';

(async () => {
  initialSetup();
  const params = [2015, 2024];
  // await createJsonChunks(...params);
  createKMLFiles(...params);
})();
