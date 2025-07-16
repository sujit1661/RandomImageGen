// db.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ypur db name',
  password: 'ur passward',
  port: 5432,
});

// Export for reuse in other files
export default pool;
