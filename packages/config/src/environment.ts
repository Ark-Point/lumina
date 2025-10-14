import * as dotenv from 'dotenv';
import * as path from 'path';

// __dirname은 packages/config/dist 를 가리키므로, ../../../ 로 루트 폴더까지 올라갑니다.
const nodeEnv = process.env.NODE_ENV || 'local';
const envPath = path.resolve(__dirname, `../../../env.${nodeEnv}`);

dotenv.config({ path: envPath });

console.log(`✅ Loading environment variables from: env.${nodeEnv}`);
