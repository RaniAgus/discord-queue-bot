export const chunkString = (
  string: string,
  maximumLength: number,
): string[] => string.match(new RegExp(`(.|[\n]){1,${maximumLength}}`, 'g')) || [];

export const stringify = (
  object: unknown,
): string => JSON.stringify(object, (_, v) => (typeof v === 'bigint' ? v.toString() : v), 2);

export const markdown = (
  string: string,
  language = '',
) => `\`\`\`${language}\n${string}\n\`\`\``;

export const split = (
  string: string,
  separators: string[],
) => string.split(new RegExp(separators.join('|'))).filter((it) => it);
