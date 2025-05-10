
import 'dotenv/config';
import { createServer } from 'http';
import { EOL } from 'os';


export const port = process.env.PORT! || 5000;
const host = 'localhost';

export const server = createServer(() => {
})

if (!process.argv.slice(2) || process.argv.slice(2)[0] !== '--multi') {
  server.listen(port, () => {
    process.stdout.write(
      `Server is running on http://${host}:${port}${EOL}`
    )
  })
}