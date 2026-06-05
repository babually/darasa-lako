import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const { fileUrl, action, fileName } = await request.json();

		if (!fileUrl) {
			return NextResponse.json(
				{ error: "fileUrl is required" },
				{ status: 400 },
			);
		}

		// Extract the path from the fileUrl if it's a full URL
		// Byteship URLs usually look like https://byteship.app/f/xxx or similar
		// For now, let's assume we can just use the URL directly or get a specialized one.

		// If the Byteship SDK provides a way to get a specialized URL:
		// const url = await byteship.getFileUrl(fileUrl, {
		//   download: action === "download",
		//   fileName: fileName,
		// });

		// Since we don't know the exact SDK method, let's use a common pattern:
		// Most storage APIs allow appending parameters for downloads.
		const url = new URL(fileUrl);
		if (action === "download") {
			url.searchParams.set("download", "1");
			if (fileName) {
				url.searchParams.set("filename", fileName);
			}
		}

		return NextResponse.json({ url: url.toString() });
	} catch (error) {
		console.error("Error generating Byteship URL:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
