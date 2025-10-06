import { verifyWebhook, WebhookEvent } from "@clerk/nextjs/webhooks";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createUser, updateUser, deleteUser } from "@/lib/actions/user.actions";
import type { UserType } from "@/types";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const evt = (await verifyWebhook(req)) as WebhookEvent;

    const eventType = evt.type;

    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address ?? "",
        username: username!,
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        type: "student" as UserType,
        photo: image_url,
      };

      const newUser = await createUser(user);

      if (newUser) {
        const client = await clerkClient();
        await client.users.updateUserMetadata(id, {
          publicMetadata: { userId: newUser._id, type: newUser.type },
        });
      }

      return NextResponse.json({ message: "User created", user: newUser });
    }

    if (eventType === "user.updated") {
      const { id, image_url, first_name, last_name, username } = evt.data;

      // Attempt to read an optional `type` from Clerk public metadata, if provided
      type WithTypeMeta = WebhookEvent & {
        data: { public_metadata?: { type?: string } };
      };
      const publicMeta = (evt as WithTypeMeta).data.public_metadata;
      const candidateType = publicMeta?.type;
      const type: UserType | undefined =
        candidateType === "student" || candidateType === "club"
          ? (candidateType as UserType)
          : undefined;

      const user = {
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        username: username!,
        photo: image_url,
        ...(type ? { type } : {}),
      };

      const updatedUser = await updateUser(id, user);

      return NextResponse.json({ message: "OK", user: updatedUser });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      const deletedUser = await deleteUser(id!);

      return NextResponse.json({ message: "OK", user: deletedUser });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
