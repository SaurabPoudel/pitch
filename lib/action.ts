"use server";

import { auth } from "@/auth";
import slugify from "slugify";

import { writeClient } from "@/sanity/lib/write-client";
import { parseServerActionResponse } from "@/lib/utils";

export type CreateIdeaState = {
  error: string;
  status: "IDEAL" | "SUCCESS" | "ERROR";
  _id?: string;
};

export const createIdea = async (
  _state: CreateIdeaState,
  form: FormData,
  pitch: string,
): Promise<CreateIdeaState> => {
  const session = await auth();
  if (!session) {
    return parseServerActionResponse({
      error: "Not signed in",
      status: "ERROR",
    });
  }

  const authorId =
    session.user &&
    "id" in session.user &&
    typeof session.user.id === "string"
      ? session.user.id
      : undefined;

  if (!authorId) {
    return parseServerActionResponse({
      error: "Authenticated user ID is unavailable",
      status: "ERROR",
    });
  }

  const { title, description, category, link } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch"),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const idea = {
      title,
      description,
      category,
      image: link,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: authorId,
      },
      pitch,
    };

    const result = await writeClient.create({ _type: "startup", ...idea });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log("Error", error);

    return parseServerActionResponse({
      error: JSON.stringify(error) || "Unknown error",
      status: "ERROR",
    });
  }
};