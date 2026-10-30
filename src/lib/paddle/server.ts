import { Environment, Paddle } from "@paddle/paddle-node-sdk";

let paddleInstance: Paddle | null = null;

export function getPaddle(): Paddle {
  if (!paddleInstance) {
    const apiKey = process.env.PADDLE_API_KEY;
    if (!apiKey) {
      throw new Error("PADDLE_API_KEY is not defined in environment variables.");
    }
    paddleInstance = new Paddle(apiKey, {
      environment:
        process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
          ? Environment.production
          : Environment.sandbox,
    });
  }
  return paddleInstance;
}

export const paddle = new Proxy({} as Paddle, {
  get(_target, prop, receiver) {
    const instance = getPaddle();
    const value = Reflect.get(instance as unknown as object, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

