import { Html, Head, Main, NextScript } from 'next/document';
import { v4 as uuidv4 } from 'uuid';

export default function Document(ctx: any) {
  // Generate a nonce for every request
  const nonce = uuidv4();
  ctx.renderPage = (App: any) => (props: any) => <App {...props} nonce={nonce} />;

  return (
    <Html>
      <Head>
        {/* Pass the nonce to all inline styles/scripts if needed */}
        <meta httpEquiv="Content-Security-Policy" content={`default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src * blob: data:; connect-src *; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';`} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
      </Head>
      <body>
        <Main />
        <NextScript nonce={nonce} />
      </body>
    </Html>
  );
}
