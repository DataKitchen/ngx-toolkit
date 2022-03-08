const alphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function getRandomString(length: number, characters: string = alphanumericCharacters): string {
  const timestamp = String((new Date()).getTime());

  return Array(length - timestamp.length)
    .fill(0)
    .reduce((result: string) => {
      const randomIndex = Math.floor(Math.random() * characters.length);
      return result + characters[randomIndex];
    }, timestamp) as string;
}
