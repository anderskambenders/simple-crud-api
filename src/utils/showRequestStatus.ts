import { IncomingMessage as IncMsg } from 'http';
import { EOL } from 'os';

export const showRequestStatus = (req: IncMsg, statusCode: number) => {
  let coloredStatusCode = '';
  const getColoredStatusCode = (colorNumber: number): string => {
    return coloredStatusCode = `\x1b[${colorNumber}m${statusCode}\x1b[0m`;
  }
  coloredStatusCode = getColoredStatusCode(31);
  if (statusCode.toString().startsWith('2')) {
    getColoredStatusCode(32);
  }
  if (statusCode.toString().startsWith('4')) {
    getColoredStatusCode(33);
  }
  process.stdout.write(
    `${req.method} ${req.url} ${coloredStatusCode}${EOL}`,
  )
}