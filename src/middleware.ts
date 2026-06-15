import { defineMiddleware } from "astro:middleware";
import { siteConfig } from "./config";

export const onRequest = defineMiddleware((context, next) => {
    const url = new URL(context.request.url);
    const langPrefix = `/${siteConfig.lang}/`;
    
    if (url.pathname.startsWith(langPrefix)) {
        return context.redirect(url.pathname.replace(`/${siteConfig.lang}`, '') || '/', 301);
    }
    if (url.pathname === `/${siteConfig.lang}`) {
        return context.redirect('/', 301);
    }
    
    return next();
});
