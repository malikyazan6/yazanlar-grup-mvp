import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notifyOwner function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("b2b.submitQuote", () => {
  it("should successfully submit a B2B quote request", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.b2b.submitQuote({
      productId: 1,
      productName: "Penetrant Test Spreyi",
      technicalCode: "PT-500",
      companyName: "Test Şirketi",
      email: "test@example.com",
      phone: "+90 212 555 0000",
      packagingType: "koli",
      quantity: 10,
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("başarıyla gönderildi");
  });

  it("should handle palet packaging type", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.b2b.submitQuote({
      productId: 2,
      productName: "ER308L TIG Teli",
      technicalCode: "ER308L",
      companyName: "Kaynak Fabrikası",
      email: "kaynak@example.com",
      phone: "+90 216 555 1111",
      packagingType: "palet",
      quantity: 5,
    });

    expect(result.success).toBe(true);
  });

  it("should reject invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.b2b.submitQuote({
        productId: 1,
        productName: "Test Product",
        technicalCode: "TEST-001",
        companyName: "Test Company",
        email: "invalid-email",
        phone: "+90 212 555 0000",
        packagingType: "koli",
        quantity: 1,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("should reject zero or negative quantity", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.b2b.submitQuote({
        productId: 1,
        productName: "Test Product",
        technicalCode: "TEST-001",
        companyName: "Test Company",
        email: "test@example.com",
        phone: "+90 212 555 0000",
        packagingType: "koli",
        quantity: 0,
      });
      expect.fail("Should have thrown validation error");
    } catch (error: any) {
      expect(error.code).toBe("BAD_REQUEST");
    }
  });

  it("should allow public access (no authentication required)", async () => {
    const ctx = createPublicContext();
    expect(ctx.user).toBeNull();

    const caller = appRouter.createCaller(ctx);
    const result = await caller.b2b.submitQuote({
      productId: 1,
      productName: "Public Test",
      technicalCode: "PUBLIC-001",
      companyName: "Public Company",
      email: "public@example.com",
      phone: "+90 212 555 0000",
      packagingType: "koli",
      quantity: 1,
    });

    expect(result.success).toBe(true);
  });
});
