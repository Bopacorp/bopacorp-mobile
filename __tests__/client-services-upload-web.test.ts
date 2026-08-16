import { apiClient } from "../services/api";
import { uploadDocumentFile } from "../services/ClientServices";
import { documentUploadResponse } from "./fixtures/critical-fixtures";

jest.mock("react-native", () => ({
  Platform: { OS: "web" },
}));

jest.mock("../services/api", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("uploadDocumentFile - web", () => {
  const apiPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("fetches the URI, appends a Blob and posts multipart data", async () => {
    const blob = new Blob(["demo"], { type: "application/pdf" });
    const fetchMock = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue(blob),
    });
    global.fetch = fetchMock as any;
    const append = jest.spyOn(FormData.prototype, "append");
    apiPost.mockResolvedValue(documentUploadResponse as any);

    await expect(
      uploadDocumentFile(
        "https://files.test/contrato-demo.pdf",
        "contrato-demo.pdf",
        "application/pdf",
      ),
    ).resolves.toEqual(documentUploadResponse);

    expect(fetchMock).toHaveBeenCalledWith("https://files.test/contrato-demo.pdf");
    expect(append).toHaveBeenCalledWith("file", blob, "contrato-demo.pdf");
    expect(apiPost).toHaveBeenCalledWith("/api/v1/document-uploads", expect.any(FormData), {
      headers: { "Content-Type": "multipart/form-data" },
    });
  });
});
