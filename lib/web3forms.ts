// Sends form data to the owner's email via Web3Forms (https://web3forms.com).
// The access key is public by design (it only allows sending to the owner's
// inbox) but still lives in .env.local, never in code.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

export type SendResult = "success" | "missing-key" | "failed";

export async function sendToOwner(
  subject: string,
  fields: Record<string, string>,
  /** Value of the hidden honeypot field — bots fill it, humans don't */
  honeypot: string,
): Promise<SendResult> {
  // Pretend success to the bot, but don't send anything
  if (honeypot) return "success";
  if (!ACCESS_KEY) return "missing-key";

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject,
        from_name: "Need For Cars website",
        ...fields,
      }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success ? "success" : "failed";
  } catch {
    return "failed";
  }
}
