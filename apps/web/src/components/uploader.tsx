"use client";

import { ByteshipClient } from "@byteship/js";

export function Uploader() {
	async function uploadFile(file: File) {
		const response = await fetch("/api/byteship/upload-token", {
			method: "POST",
		});
		const data = await response.json();

		const byteship = new ByteshipClient({
			uploadToken: data.token,
		});

		return byteship.upload(file, {
			path: `uploads/resources/${file.name}`,
			visibility: "public",
		});
	}

	return (
		<input
			type="file"
			accept=".pdf,.docx,.xlsx,.pptx"
			onChange={(event) => {
				const file = event.currentTarget.files?.[0];
				if (file) void uploadFile(file);
			}}
		/>
	);
}
