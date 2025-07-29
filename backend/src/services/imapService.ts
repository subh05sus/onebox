import { simpleParser, ParsedMail, AddressObject } from "mailparser";
import { createImapClient, ImapAccountConfig } from "../config/imapConfig";

function extractAddresses(input?: AddressObject | AddressObject[]): string[] {
  if (!input) return [];
  const groups = Array.isArray(input) ? input : [input];
  return groups.flatMap((group) =>
    (group.value ?? []).map((addr) => addr.address || "")
  );
}

function shouldSkipFolder(folder: string): boolean {
  const lower = folder.toLowerCase();
  return (
    lower.includes("trash") ||
    lower.includes("spam") ||
    lower.includes("draft") ||
    lower.includes("junk")
  );
}

export async function syncEmails(accounts: ImapAccountConfig[]) {
  const sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  for (const account of accounts) {
    const client = await createImapClient(account);
    const boxes = await client.list();

    console.log(`📦 All folders for ${account.user}:`);
    boxes.forEach((box) => console.log(`   • ${box.path}`));

    // Store mailbox states for IDLE mode
    const mailboxStates = new Map<string, number>();

    for (const box of boxes) {
      const mailbox = box.path;

      if (box.flags?.has("\\Noselect") || shouldSkipFolder(mailbox)) {
        console.log(`⚠️ Skipping folder: ${mailbox}`);
        continue;
      }

      console.log(`📁 Syncing mailbox: ${mailbox} for ${account.user}`);

      try {
        await client.mailboxOpen(mailbox);
      } catch (err) {
        console.error(`❌ Error opening ${mailbox} for ${account.user}:`, err);
        continue;
      }

      const uids = await client.search({ since: sinceDate });
      let highestUid = 0;

      if (uids && Array.isArray(uids)) {
        for await (const msg of client.fetch(uids, {
          envelope: true,
          source: true,
        })) {
          await processAndStoreEmail(msg, account.user, mailbox);
          highestUid = Math.max(highestUid, msg.uid!);
        }

        console.log(
          `✅ Synced ${uids.length} emails from ${mailbox} for ${account.user}`
        );
      }

      // Store the highest UID for this mailbox
      mailboxStates.set(mailbox, highestUid);
    }

    // Start IDLE mode for real-time updates
    await startIdleMode(client, account.user, mailboxStates);
  }
}

async function startIdleMode(
  client: any,
  accountUser: string,
  mailboxStates: Map<string, number>
) {
  console.log(`⏳ Starting IDLE mode for ${accountUser}...`);

  // Set up event listeners for real-time updates
  client.on("mail", async (mailbox: string) => {
    console.log(`📬 New mail event in ${mailbox} for ${accountUser}`);

    const highestUid = mailboxStates.get(mailbox) || 0;
    const newRange = `${highestUid + 1}:*`;

    try {
      await client.mailboxOpen(mailbox);

      for await (const msg of client.fetch(newRange, {
        envelope: true,
        source: true,
      })) {
        await processAndStoreEmail(msg, accountUser, mailbox);
        mailboxStates.set(mailbox, Math.max(highestUid, msg.uid!));
        console.log(`   • Processed new UID ${msg.uid} from ${mailbox}`);
      }
    } catch (err) {
      console.error(`❌ Error processing new mail in ${mailbox}:`, err);
    }
  });

  // Handle connection errors and reconnection
  client.on("error", (err: any) => {
    console.error(`❌ IMAP connection error for ${accountUser}:`, err);
    // TODO: Implement reconnection logic
  });

  client.on("close", () => {
    console.log(`🔌 IMAP connection closed for ${accountUser}`);
    // TODO: Implement reconnection logic
  });

  // Start IDLE mode with proper error handling
  try {
    // Use the idle() method to start listening for new emails
    await client.idle();
    console.log(
      `✅ IDLE mode active for ${accountUser} - listening for real-time updates`
    );
  } catch (err) {
    console.error(`❌ Failed to start IDLE mode for ${accountUser}:`, err);
    // Fallback to polling if IDLE fails
    console.log(`🔄 Falling back to polling mode for ${accountUser}`);
    startPollingMode(client, accountUser, mailboxStates);
  }
}

async function startPollingMode(
  client: any,
  accountUser: string,
  mailboxStates: Map<string, number>
) {
  console.log(`🔄 Starting polling mode for ${accountUser} (every 30 seconds)`);

  const pollInterval = setInterval(async () => {
    try {
      for (const [mailbox, lastUid] of mailboxStates) {
        const newRange = `${lastUid + 1}:*`;

        try {
          await client.mailboxOpen(mailbox);

          for await (const msg of client.fetch(newRange, {
            envelope: true,
            source: true,
          })) {
            await processAndStoreEmail(msg, accountUser, mailbox);
            mailboxStates.set(mailbox, Math.max(lastUid, msg.uid!));
            console.log(`   • Polled new UID ${msg.uid} from ${mailbox}`);
          }
        } catch (err) {
          console.error(`❌ Error polling ${mailbox}:`, err);
        }
      }
    } catch (err) {
      console.error(`❌ Polling error for ${accountUser}:`, err);
      clearInterval(pollInterval);
    }
  }, 30000); // Poll every 30 seconds

  // Store the interval for cleanup
  client.pollInterval = pollInterval;
}

async function processAndStoreEmail(
  msg: any,
  accountUser: string,
  mailbox: string
) {
  const parsed: ParsedMail = await simpleParser(msg.source!);
  const fromAddrs = extractAddresses(parsed.from);
  const toAddrs = extractAddresses(parsed.to);
  const htmlBody = typeof parsed.html === "string" ? parsed.html : "";
  const subject = parsed.subject ?? msg.envelope.subject ?? "";
  const textBody = parsed.text ?? htmlBody;

  // TODO: Implement AI embeddings and classification
  // let embedding: number[] = [];
  // let category = '';
  // try {
  //   const emailContent = `${subject}\n\n${textBody}`;
  //   embedding = await getEmbedding(emailContent);
  //   category = await classifyWithElasticsearch(embedding);
  //   console.log(`🧠 [${accountUser} | ${mailbox}] RAG Classified as: ${category}`);
  // } catch (err) {
  //   console.error(`⚠️ [${accountUser} | ${mailbox}] Classification error:`, err);
  // }

  const doc = {
    subject,
    text: parsed.text ?? "",
    html: htmlBody,
    date: msg.envelope.date!,
    from: fromAddrs[0] ?? "",
    to: toAddrs,
    folder: mailbox,
    account: accountUser,
    uid: msg.uid!,
    // category, // TODO: Implement classification
    // vector: embedding, // TODO: Implement embeddings
  };

  // TODO: Implement Slack notifications and webhooks
  // if (category === 'Interested') {
  //   await sendSlackNotification(subject, fromAddrs[0] ?? '', accountUser);
  //   await triggerWebhook(doc);
  // }

  // TODO: Implement Elasticsearch storage
  // await saveEmailToElasticsearch(doc);

  console.log(
    `📧 Processed email: ${subject} from ${fromAddrs[0]} in ${mailbox}`
  );
}
