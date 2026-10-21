# LinkLens

## Google Safe Browsing

URL checks are sent from the server through `POST /api/check-url`. For local
development, add the Google API key to `.env.local`:

```text
SAFE_BROWSING_API_KEY=your-api-key
```

Enable the **Safe Browsing API** for the Google Cloud project that owns the key.
If the request fails, the page shows Google's HTTP status and error message;
check that the key is valid, the API is enabled, and the key's API/application
restrictions allow Safe Browsing requests. Keep the key server-side and never
use a `NEXT_PUBLIC_` prefix for it.

The external reputation check reports five indicators: phishing and malware
matches from Google Safe Browsing, Google threat-list reputation/report
matches, and domain registration age from RDAP. RDAP can be unavailable for
some domains. A recent registration is only a risk signal, not proof of abuse.
The URL is sent to Google Safe Browsing and its registrable domain is queried
through RDAP when the external check is selected.

The Safe Browsing API is intended for non-commercial use. Use Google Web Risk
for commercial URL threat detection.
