export function log(msg: string, ...params: any) {
  // In production, you might want to use a proper logging service
  // For now, we'll use console.log but with a more structured approach
  if (process.env.NODE_ENV === 'development') {
    let logColor = '\x1b[37m%s\x1b[0m';
    switch (true) {
      case msg.startsWith('POST'):
        logColor = '\x1b[33m%s\x1b[0m';
        break;
      case msg.startsWith('PATCH'):
        logColor = '\x1b[35m%s\x1b[0m';
        break;
      case msg.startsWith('GET'):
        logColor = '\x1b[36m%s\x1b[0m';
        break;
      case msg.startsWith('DELETE'):
        logColor = '\x1b[31m%s\x1b[0m';
        break;
      default:
        logColor = '\x1b[37m%s\x1b[0m';
        break;
    }
    // eslint-disable-next-line no-console
    console.log(
      logColor,
      `[${process.pid} - ${new Date().toLocaleString()}] ${msg}`,
      ...params
    );
  }
}
