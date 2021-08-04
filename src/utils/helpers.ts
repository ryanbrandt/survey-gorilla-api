export const getHostUrl = (): string =>
  process.env.NODE_ENV === "development"
    ? `${process.env.APP_URL}:${process.env.APP_PORT}`
    : `${process.env.APP_URL}`;

export const shouldInclude = (
  include: Array<string>,
  entity: string
): boolean =>
  include.find((includeEntity) => includeEntity === entity) !== undefined;
