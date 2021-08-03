export const getHostUrl = (): string =>
  `${process.env.APP_URL}:${process.env.APP_PORT}`;

export const shouldInclude = (
  include: Array<string>,
  entity: string
): boolean =>
  include.find((includeEntity) => includeEntity === entity) !== undefined;
