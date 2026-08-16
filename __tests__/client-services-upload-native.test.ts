import { apiClient } from "../services/api";
import { uploadDocumentFile } from "../services/ClientServices";
import { documentUploadResponse } from "./fixtures/critical-fixtures";

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

jest.mock("../services/api", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe("uploadDocumentFile - native", () => {
  const apiPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("builds a native file part and posts multipart data", async () => {
    const append = jest.spyOn(FormData.prototype, "append");
    apiPost.mockResolvedValue(documentUploadResponse as any);

    await expect(
      uploadDocumentFile(
        "file:///documents/contrato-demo.pdf",
        "contrato-demo.pdf",
        "application/pdf",
      ),
    ).resolves.toEqual(documentUploadResponse);

    expect(append).toHaveBeenCalledWith("file", {
      uri: "file:///documents/contrato-demo.pdf",
      name: "contrato-demo.pdf",
      type: "application/pdf",
    });
    expect(apiPost).toHaveBeenCalledWith("/api/v1/document-uploads", expect.any(FormData), {
      headers: { "Content-Type": "multipart/form-data" },
    });
  });
});
