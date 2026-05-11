import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // B2B Quote Requests
  b2b: router({
    submitQuote: publicProcedure
      .input(z.object({
        productId: z.number(),
        productName: z.string(),
        technicalCode: z.string(),
        companyName: z.string(),
        email: z.string().email(),
        phone: z.string(),
        packagingType: z.enum(["koli", "palet"]),
        quantity: z.number().min(1),
      }))
      .mutation(async ({ input }) => {
        try {
          // Send notification to owner
          const title = `Yeni B2B Teklif Talebı: ${input.productName}`;
          const content = `
Şirket: ${input.companyName}
E-posta: ${input.email}
Telefon: ${input.phone}
Ürün: ${input.productName} (${input.technicalCode})
Paketleme: ${input.packagingType === "koli" ? "Koli" : "Palet"} Bazlı
Miktar: ${input.quantity}
          `.trim();
          
          await notifyOwner({ title, content });
          
          return {
            success: true,
            message: "Teklif talebiniz başarıyla gönderildi. En kısa sürede size dönüş yapılacaktır."
          };
        } catch (error) {
          console.error("B2B quote submission error:", error);
          return {
            success: false,
            message: "Teklif talebiniz kaydedildi, ancak bildirim gönderilemedi. Lütfen daha sonra tekrar deneyin."
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
