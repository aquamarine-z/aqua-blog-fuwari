import { defineMiddleware } from "astro:middleware";
import { siteConfig } from "./config";
import { stripBasePath, url } from "./utils/url-utils";

export const onRequest = defineMiddleware((context, next) => {
	const requestUrl = new URL(context.request.url);
	const pathname = stripBasePath(requestUrl.pathname);
	const langPrefix = `/${siteConfig.lang}/`;

	if (pathname.startsWith(langPrefix)) {
		return context.redirect(
			`${url(pathname.replace(`/${siteConfig.lang}`, "") || "/")}${requestUrl.search}`,
			301,
		);
	}
	if (pathname === `/${siteConfig.lang}`) {
		return context.redirect(`${url("/")}${requestUrl.search}`, 301);
	}

	return next();
});
