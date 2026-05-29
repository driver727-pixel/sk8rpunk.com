/**
 * Thin wrapper around @fal-ai/client pinned exclusively to fal-ai/nano-banana-2.
 * Uses BYO key stored in sessionStorage.
 */
import { fal } from "@fal-ai/client";
import { getFalKey } from "./storage";
import type { GeneratePanelRequest, GeneratePanelResult } from "./types";

const MODEL_ID = "fal-ai/nano-banana-2";

function ensureConfigured(): void {
  const key = getFalKey();
  if (!key) throw new Error("fal.ai API key not set. Please enter your key in settings.");
  fal.config({ credentials: key });
}

export async function generatePanelImage(
  request: GeneratePanelRequest,
): Promise<GeneratePanelResult> {
  ensureConfigured();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const input: any = {
    prompt: request.prompt,
    aspect_ratio: request.aspectRatio,
    resolution: request.resolution,
    output_format: "png",
    num_images: 1,
  };

  if (request.seed !== undefined) {
    input.seed = request.seed;
  }

  // If reference images are supplied, use the /edit endpoint for visual consistency.
  const endpoint = request.imageUrls.length > 0 ? `${MODEL_ID}/edit` : MODEL_ID;

  if (request.imageUrls.length > 0) {
    input.image_urls = request.imageUrls;
  }

  const result = await fal.subscribe(endpoint, { input });

  const data = result.data as { images: { url: string }[]; seed?: number };

  return {
    imageUrl: data.images[0].url,
    seed: data.seed ?? request.seed ?? 0,
  };
}
