import { defineMiddleware } from "astro:middleware";
import { auth } from "./server/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const sessionData = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (sessionData) {
    context.locals.user = sessionData.user;
    context.locals.session = sessionData.session;
  } else {
    context.locals.user = null;
    context.locals.session = null;
  }

  return next();
});
