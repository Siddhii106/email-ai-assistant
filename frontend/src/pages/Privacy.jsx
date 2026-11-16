export default function Privacy() {
  return (
    <div className="min-h-screen bg-cream px-6 py-12">
      <article className="card mx-auto max-w-3xl space-y-6 p-10 text-[15px] leading-relaxed text-ink-muted">
        <header className="border-b border-line pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-olive-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-ink-subtle">Last updated: November 16, 2026</p>
        </header>

        <section className="space-y-2">
          <p>
            Mailmind is a personal email assistant project. It helps a signed-in user read, summarize,
            prioritize, and reply to their Gmail messages. This policy explains what data the app
            accesses, how it is used, and how you can remove it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">Data we access</h2>
          <p>
            When you sign in with Google, you grant Mailmind access to your name, email address, and
            profile picture. You also grant permission to read your Gmail messages, change their labels
            (for example, starred, archived, or moved to trash), and send email on your behalf. We
            request only the permissions needed for these features.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">How we use it</h2>
          <p>
            We use your Gmail data only to display your messages in the inbox, to generate summaries,
            action items, priority labels, and reply drafts when you request them, and to send and label
            messages when you ask us to. We do not use Gmail data for advertising, we do not sell it, and
            we do not use it to train AI models.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">AI processing</h2>
          <p>
            When you click Analyze or Draft reply, the content of the selected message is sent to
            Anthropic's API, which generates the response. This happens only when you request it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">What we store</h2>
          <p>
            Mailmind stores your name, email address, profile picture URL, and a Google refresh token.
            The refresh token lets the app access Gmail without asking you to sign in every time. The app
            also stores AI analysis results for messages you analyzed, so they load faster. We do not keep
            a copy of your mailbox. Messages are fetched from Gmail when you open them.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">Where data is hosted</h2>
          <p>
            The web app is hosted on Vercel. The backend API runs on Render. The database is hosted on
            Neon. All connections use HTTPS.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">Sharing</h2>
          <p>
            We share data only with the service providers listed above, and only as needed to run the app.
            We do not share your data with anyone else, except where the law requires it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">Google API Services User Data Policy</h2>
          <p>
            Mailmind's use and transfer of information received from Google APIs follows the Google API
            Services User Data Policy, including its Limited Use requirements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">Your choices</h2>
          <p>
            You can remove Mailmind's access to your Google account at any time at{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noreferrer"
              className="text-olive-700 underline"
            >
              myaccount.google.com/permissions
            </a>
            . Removing access stops all Gmail access immediately. To delete your stored data, email us at
            the address below and we will remove it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">Security</h2>
          <p>
            Access tokens expire after one hour, and we keep stored data to the minimum the app needs.
            No system is perfectly secure, so we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">Children</h2>
          <p>Mailmind is not intended for anyone under 13.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">Changes</h2>
          <p>
            We may update this policy. When we do, we will change the date at the top of this page.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-olive-900">Contact</h2>
          <p>
            Questions or deletion requests: <span className="font-medium text-ink">your-email@example.com</span>
          </p>
        </section>
      </article>
    </div>
  );
}