/**
 * Cached LeetCode proxy.
 *
 * LeetCode's GraphQL endpoint refuses cross-origin browser requests, so the
 * page cannot call it directly. This runs server-side, where CORS doesn't
 * apply, and caches the response at the CDN for an hour — LeetCode sees at
 * most 24 requests a day no matter how much traffic the site gets.
 *
 * Drop this file at  api/leetcode.js  next to index.html and deploy to
 * Vercel. The page already calls /api/leetcode first and falls back to public
 * mirrors if it isn't there, so a static-only deploy still works.
 */

const DEFAULT_USER = "harshul17";

const QUERY = `
  query($u: String!) {
    matchedUser(username: $u) {
      username
      submissionCalendar
      submitStats {
        acSubmissionNum { difficulty count }
      }
    }
  }`;

module.exports = async (req, res) => {
  const user = (req.query && req.query.u) || DEFAULT_USER;

  try {
    const r = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // LeetCode rejects requests without a plausible origin
        Referer: `https://leetcode.com/u/${user}/`,
        "User-Agent": "Mozilla/5.0 (portfolio-site)",
      },
      body: JSON.stringify({ query: QUERY, variables: { u: user } }),
    });

    if (!r.ok) throw new Error(`leetcode responded ${r.status}`);

    const body = await r.json();
    const matched = body && body.data && body.data.matchedUser;
    if (!matched) throw new Error("no such user, or the response shape changed");

    // Cache at the edge for an hour; keep serving the stale copy for a day
    // while it refreshes, so a LeetCode outage never blanks the section.
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ matchedUser: matched });
  } catch (err) {
    // Short cache on errors so a transient failure doesn't stick around.
    res.setHeader("Cache-Control", "public, s-maxage=60");
    return res.status(502).json({ error: String(err.message || err) });
  }
};
