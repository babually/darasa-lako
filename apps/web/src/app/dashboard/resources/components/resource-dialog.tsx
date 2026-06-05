"use client";

import { ByteshipClient } from "@byteship/js";
import { Button } from "@darasa-lako/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@darasa-lako/ui/components/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@darasa-lako/ui/components/field";
import { Input } from "@darasa-lako/ui/components/input";
import {
	InputGroup,
	InputGroupTextarea,
} from "@darasa-lako/ui/components/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@darasa-lako/ui/components/select";
import { useForm } from "@tanstack/react-form";
import {
	CloudUploadIcon,
	FileTextIcon,
	Loader2Icon,
	TrashIcon,
	XIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useResources } from "@/app/store/resource-state";

const resourceTypes = [
	{ label: "Notes", value: "notes" },
	{ label: "Exam", value: "exam" },
	{ label: "Resource", value: "resource" },
];

const resourceSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string(),
	type: z.string().min(1, "Type is required"),
	subject: z.string().min(1, "Subject is required"),
	grade: z.string().min(1, "Grade is required"),
	uploader: z.string(),
	fileUrl: z.string().min(1, "File is required"),
	fileSize: z.number().int(),
	fileName: z.string(),
	viewCount: z.number().int(),
	tags: z.array(z.string()),
});

export function ResourceDialog({
	hideTrigger = false,
}: {
	hideTrigger?: boolean;
}) {
	const resourcesState = useResources();

	const fileRef = useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	const open = resourcesState.activeResourceEditId !== undefined;
	const mode =
		resourcesState.activeResourceEditId === "new" ? "create" : "edit";

	const resource = resourcesState.resources?.find(
		(r) => r.id === resourcesState.activeResourceEditId,
	);

	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
			type: "",
			subject: "",
			grade: "",
			uploader: "",
			fileUrl: "",
			fileSize: 0,
			viewCount: 0,
			fileName: "",
			tags: [] as string[],
		},
		validators: {
			onChange: resourceSchema,
		},
		onSubmit: async ({ value }) => {
			const currentMode =
				resourcesState.activeResourceEditId === "new" ? "create" : "edit";
			const currentResource = resourcesState.resources?.find(
				(r) => r.id === resourcesState.activeResourceEditId,
			);

			try {
				if (currentMode === "create") {
					await resourcesState.addResource({
						title: value.title,
						description: value.description || "",
						type: value.type,
						subject: value.subject,
						grade: value.grade,
						fileUrl: value.fileUrl || "",
						fileSize: value.fileSize || 0,
						viewCount: value.viewCount || 0,
						tags: value.tags || [],
					});
					toast.success("Resource created successfully");
					resourcesState.setActiveResourceEditId(undefined);
				} else if (currentMode === "edit") {
					if (!currentResource) return;
					await resourcesState.updateResource(currentResource.id, {
						title: value.title,
						description: value.description || "",
						type: value.type,
						subject: value.subject,
						grade: value.grade,
						fileUrl: value.fileUrl || "",
						fileSize: value.fileSize || 0,
						viewCount: value.viewCount || 0,
						tags: value.tags || [],
					});
					toast.success("Resource updated successfully");
					resourcesState.setActiveResourceEditId(undefined);
				}
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to submit resource";
				console.error("Error submitting resource:", err);
				toast.error(message);
			}
		},
	});

	const uploadToByteship = async (file: File) => {
		setIsUploading(true);
		try {
			const response = await fetch("/api/byteship/upload-token", {
				method: "POST",
			});
			if (!response.ok) throw new Error("Failed to get upload token");
			const data = await response.json();

			const byteship = new ByteshipClient({
				uploadToken: data.token,
			});

			await byteship.upload(file, {
				path: `uploads/resources/${Date.now()}-${file.name}`,
				visibility: "public",
			});

			form.setFieldValue("fileUrl", file.name);
			form.setFieldValue("fileSize", file.size);
			form.setFieldValue("fileName", file.name);
			toast.success("File uploaded successfully");
		} catch (error) {
			console.error("Upload error:", error);
			toast.error("Failed to upload file");
		} finally {
			setIsUploading(false);
		}
	};

	// Handle file drop/change
	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (
			file &&
			file.type === "application/pdf" &&
			file.size <= 50 * 1024 * 1024
		) {
			await uploadToByteship(file);
		} else if (file) {
			toast.error("Invalid file. Please upload a PDF under 50MB.");
		}
		setDragging(false);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (
			file &&
			file.type === "application/pdf" &&
			file.size <= 50 * 1024 * 1024
		) {
			await uploadToByteship(file);
		} else if (file) {
			toast.error("Invalid file. Please upload a PDF under 50MB.");
		}
	};

	// Update form values when resource changes
	useEffect(() => {
		if (resource) {
			form.setFieldValue("title", resource.title || "");
			form.setFieldValue("description", resource.description || "");
			form.setFieldValue("type", resource.type || "");
			form.setFieldValue("subject", resource.subject || "");
			form.setFieldValue("grade", resource.grade || "");
			form.setFieldValue("fileUrl", resource.fileUrl || "");
			form.setFieldValue("fileSize", resource.fileSize || 0);
			form.setFieldValue("fileName", resource.title || "");
			form.setFieldValue("viewCount", resource.viewCount || 0);
			form.setFieldValue("tags", resource.tags || []);
			form.setFieldValue(
				"uploader",
				resource.uploader
					? String(resource.uploader.name || resource.uploader.id)
					: "",
			);
		} else {
			form.setFieldValue("title", "");
			form.setFieldValue("description", "");
			form.setFieldValue("type", "");
			form.setFieldValue("subject", "");
			form.setFieldValue("grade", "");
			form.setFieldValue("fileUrl", "");
			form.setFieldValue("fileSize", 0);
			form.setFieldValue("fileName", "");
			form.setFieldValue("tags", []);
			form.setFieldValue("viewCount", 0);
			form.setFieldValue("uploader", "");
		}
	}, [resource, form]);

	async function handleDelete() {
		if (mode === "create" || !resource) return;

		try {
			await resourcesState.deleteResource(resource.id);
			toast.success("Resource deleted successfully");
			resourcesState.setActiveResourceEditId(undefined);
		} catch (error) {
			toast.error("Failed to delete resource");
			console.error("Error deleting resource:", error);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) resourcesState.setActiveResourceEditId(undefined);
			}}
		>
			{!hideTrigger && (
				<DialogTrigger
					render={
						<Button
							variant="outline"
							onClick={() => resourcesState.setActiveResourceEditId("new")}
						>
							Create Resource
						</Button>
					}
				/>
			)}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{mode === "edit" ? "Update resource" : "Create new resource"}
					</DialogTitle>
				</DialogHeader>
				<form
					className="contents"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<FieldGroup>
						<form.Field name="title">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Resource Title</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder="e.g. Introduction to Calculus"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="description">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Description</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Detailed description of the resource..."
												aria-invalid={isInvalid}
											/>
										</InputGroup>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<div className="grid grid-cols-2 gap-4">
							<form.Field name="type">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Type</FieldLabel>
											<Select
												value={field.state.value}
												onValueChange={(val) => {
													field.handleChange(val ?? "");
													field.handleBlur();
												}}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select a resource type" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														{resourceTypes.map((type) => (
															<SelectItem key={type.value} value={type.value}>
																{type.label}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="subject">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Subject</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="e.g. Mathematics"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="grade">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Grade</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												placeholder="e.g. Grade 10"
												autoComplete="off"
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
						</div>
						<form.Field name="tags">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								const displayValue = Array.isArray(field.state.value)
									? field.state.value.join(", ")
									: field.state.value || "";
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Tags</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={displayValue}
											onBlur={field.handleBlur}
											onChange={(e) => {
												const val = e.target.value;
												const tagsArray = val
													? val.split(",").map((t) => t.trim())
													: [];
												field.handleChange(tagsArray);
											}}
											aria-invalid={isInvalid}
											placeholder="e.g. algebra, calculus"
											autoComplete="off"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="fileUrl">
							{(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<button
											type="button"
											onDragOver={(e) => {
												e.preventDefault();
												setDragging(true);
											}}
											onDragLeave={() => setDragging(false)}
											onDrop={handleDrop}
											onClick={() => !isUploading && fileRef.current?.click()}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													if (!isUploading) fileRef.current?.click();
												}
											}}
											className={`relative w-full cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
												dragging
													? "border-primary/60 bg-primary/5"
													: field.state.value
														? "border-emerald-500/40 bg-emerald-500/5"
														: "border-border bg-muted/30 hover:border-border/80"
											} ${isUploading ? "cursor-not-allowed opacity-50" : ""}`}
										>
											<input
												ref={fileRef}
												type="file"
												accept=".pdf"
												className="hidden"
												disabled={isUploading}
												onChange={handleFileChange}
											/>
											{isUploading ? (
												<div className="flex flex-col items-center justify-center gap-2">
													<Loader2Icon className="h-8 w-8 animate-spin text-primary" />
													<p className="text-muted-foreground text-sm">
														Uploading...
													</p>
												</div>
											) : field.state.value ? (
												<div className="flex items-center justify-center gap-3">
													<FileTextIcon className="h-8 w-8 text-emerald-500" />
													<div className="text-left">
														<p className="font-medium text-emerald-600 text-sm dark:text-emerald-400">
															{field.form.state.values.fileName ||
																field.state.value}
														</p>
														<p className="text-muted-foreground text-xs">
															{(
																field.form.state.values.fileSize /
																1024 /
																1024
															).toFixed(2)}{" "}
															MB
														</p>
													</div>
													<button
														type="button"
														onClick={(e) => {
															e.stopPropagation();
															field.form.setFieldValue("fileUrl", "");
															field.form.setFieldValue("fileSize", 0);
															field.form.setFieldValue("fileName", "");
														}}
														className="ml-auto text-muted-foreground hover:text-foreground"
													>
														<XIcon className="h-4 w-4" />
													</button>
												</div>
											) : (
												<>
													<CloudUploadIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
													<p className="text-muted-foreground text-sm">
														Drop PDF here or{" "}
														<span className="text-primary">browse</span>
													</p>
													<p className="mt-1 text-muted-foreground/60 text-xs">
														PDF files only, max 50 MB
													</p>
												</>
											)}
										</button>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
					</FieldGroup>
					<div className="mt-4 flex justify-end">
						<Button
							variant="destructive"
							type="button"
							disabled={mode !== "edit"}
							data-testid={
								mode === "edit"
									? `delete-resource-${resource?.title}`
									: "delete-resource-disabled"
							}
							onClick={handleDelete}
						>
							<TrashIcon className="mr-2 h-4 w-4" />
							Delete
						</Button>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button
									type="submit"
									disabled={!canSubmit || isSubmitting}
									data-testid={
										mode === "edit"
											? `update-resource-${resource?.title}-submit`
											: "create-resource-submit"
									}
								>
									{isSubmitting
										? "Saving..."
										: mode === "edit"
											? "Update"
											: "Create"}
								</Button>
							)}
						</form.Subscribe>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
