export const apiRequest = async (url, options = {}) => {
  const doFetch = async (tokenOverride) => {
    console.log("ENDPOINT URL:", url);
    console.log("ACCESS TOKEN:", tokenOverride ? "✅ present" : "❌ missing");

    const res = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(tokenOverride ? { Authorization: `Bearer ${tokenOverride}` } : {}),
        ...(options.headers || {}),
      },
      body: options.body,
    });

    const contentType = res.headers.get("content-type") || "";
    const rawText = await res.text();

    let data = {};
    if (contentType.includes("application/json")) {
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        data = {};
      }
    } else {
      // HTML / plain text (like Django debug 404 page)
      data = { _raw: rawText.slice(0, 300) }; // first 300 chars
    }

    console.log("STATUS:", res.status, "CONTENT-TYPE:", contentType);
    if (!res.ok) console.log("RAW (first 300):", rawText.slice(0, 300));

    return { res, data };
  };

  const extractMsg = (data, status) => {
    if (!data) return `Request failed (${status})`;

    // common API formats
    const base =
      data?.message ||
      data?.detail ||
      data?.error ||
      (typeof data === "string" ? data : null);

    if (base) return base;

    // Django field errors: { field: ["msg"] }
    if (typeof data === "object") {
      try {
        const flat = Object.entries(data)
          .map(([k, v]) =>
            Array.isArray(v) ? `${k}: ${v.join(" ")}` : `${k}: ${String(v)}`,
          )
          .join(" | ");
        if (flat) return flat;
      } catch {}
    }

    return `Request failed (${status})`;
  };

  try {
    // 1) first attempt
    const first = await doFetch(options.token);

    console.log("STATUS:", first.res.status, "DATA:", first.data);

    // 2) if unauthorized -> refresh -> retry once
    if (
      first.res.status === 401 &&
      typeof options.onUnauthorized === "function"
    ) {
      const newToken = await options.onUnauthorized();
      if (newToken) {
        const retry = await doFetch(newToken);

        console.log(
          "RETRY STATUS:",
          retry.res.status,
          "RETRY DATA:",
          retry.data,
        );

        if (!retry.res.ok) {
          throw new Error(extractMsg(retry.data, retry.res.status));
        }

        return retry.data;
      }
    }

    // 3) normal error
    if (!first.res.ok) {
      throw new Error(extractMsg(first.data, first.res.status));
    }

    return first.data;
  } catch (err) {
    console.log("API ERROR:", err.message);
    console.log("API ERROR EXTENDED:", err);
    throw err;
  }
};
