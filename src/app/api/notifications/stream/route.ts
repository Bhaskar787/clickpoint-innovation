import { registerSSESubscriber } from "@/lib/sse-bus";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (err) {
          // Stream closed
        }
      };

      const unbind = registerSSESubscriber(send);

      // Initial heartbeat connection event
      send({ type: "CONNECTED", timestamp: new Date().toISOString() });

      request.signal.addEventListener("abort", () => {
        unbind();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
