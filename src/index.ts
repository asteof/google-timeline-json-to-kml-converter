import { createJsonFiles } from './CreateChunks';
import { createKMLFiles } from './CreateKML';
import { initialSetup } from './InitialSetup';

(async () => {
  initialSetup();
  const params = [2015, 2024];
  await createJsonFiles(...params);
  createKMLFiles(...params);
})();
