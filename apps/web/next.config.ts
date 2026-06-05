import "@darasa-lako/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	experimental: {
		serverMinification: false,
	},
};

export default nextConfig;
