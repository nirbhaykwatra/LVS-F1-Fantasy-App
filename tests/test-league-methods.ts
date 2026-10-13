import 'dotenv/config';
import { addLeague } from '@/lib/dal/leagues';

const result = await addLeague("Test League", 1, 1, 1, "public");
console.log(result);