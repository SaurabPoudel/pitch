import { client } from "@/sanity/lib/client";
import Ping from "./Ping";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { writeClient } from "@/sanity/lib/write-client";
import { after } from "next/server";

const View = async ({ id }: { id: string }) => {
  const result = await client
    .withConfig({ useCdn: false })
    .fetch(STARTUP_VIEWS_QUERY, { id });

  const totalViews = result?.views ?? 0;

  after(async () => {
    if (writeClient.config().token) {
      try {
        await writeClient
          .patch(id)
          .set({ views: totalViews + 1 })
          .commit();
      } catch (error) {
        console.error("Failed to update view count:", error);
      }
    }
  });

  return (
    <div className="view-container">
      <div className="absolute -top-2 -right-2">
        <Ping />
      </div>
      <p className="view-text">
        <span className="font-black"> Views: {totalViews} </span>
      </p>
    </div>
  );
};

export default View;
