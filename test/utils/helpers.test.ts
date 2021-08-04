import { getHostUrl, shouldInclude } from "../../src/utils/helpers";

describe("getHostUrl", () => {
  describe("when development", () => {
    const mockUrl = "http://localhost";
    const mockPort = "8080";

    beforeAll(() => {
      process.env.APP_URL = mockUrl;
      process.env.APP_PORT = mockPort;
      process.env.NODE_ENV = "development";
    });

    it("returns the env app url and port", () => {
      expect(getHostUrl()).toBe(`${mockUrl}:${mockPort}`);
    });
  });

  describe("when production", () => {
    const mockUrl = "https://deployed-url.com";

    beforeAll(() => {
      process.env.APP_URL = mockUrl;
      process.env.NODE_ENV = "production";
    });

    it("returns the env app url", () => {
      expect(getHostUrl()).toBe(mockUrl);
    });
  });
});

describe("shouldInclude", () => {
  describe("when entity is in include", () => {
    it("returns true", () => {
      expect(shouldInclude(["user", "question"], "user")).toBeTruthy();
    });
  });

  describe("when entity is not in include", () => {
    it("returns false", () => {
      expect(shouldInclude(["answer", "question"], "user")).toBeFalsy();
    });
  });
});
