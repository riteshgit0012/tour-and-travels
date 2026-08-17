import {
  FLEET,
  FEATURES,
  DESTINATIONS,
  TESTIMONIALS,
  STATS,
} from "./data/siteData";

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

async function getJSON(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

// ---------------- CONTENT ----------------

export async function fetchFleet() {
  try {
    const data = await getJSON("/fleet");
    return data.fleet ?? FLEET;
  } catch {
    return FLEET;
  }
}

export async function fetchFeatures() {
  try {
    const data = await getJSON("/features");
    return data.features ?? FEATURES;
  } catch {
    return FEATURES;
  }
}

export async function fetchDestinations() {
  try {
    const data = await getJSON("/destinations");
    return data.destinations ?? DESTINATIONS;
  } catch {
    return DESTINATIONS;
  }
}

export async function fetchGallery() {
  try {
    const data = await getJSON("/gallery/images");
    return data.gallery ?? [];
  } catch {
    return [];
  }
}

export async function fetchTestimonials() {
  try {
    const data = await getJSON("/testimonials");
    return data.testimonials ?? TESTIMONIALS;
  } catch {
    return TESTIMONIALS;
  }
}

export async function fetchStats() {
  try {
    const data = await getJSON("/stats");
    return data.stats ?? STATS;
  } catch {
    return STATS;
  }
}

// ---------------- FORMS ----------------

async function postJSON(path, payload) {
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const detail = Array.isArray(data?.detail)
        ? data.detail.map((d) => d.msg).join(", ")
        : data?.detail;

      return {
        ok: false,
        message:
          detail || "Something went wrong. Please try again.",
      };
    }

    return {
      ok: true,
      message:
        data.message || "Submitted successfully!",
    };
  } catch {
    return {
      ok: false,
      message:
        "We couldn't reach the server. Please call or WhatsApp us and we'll help right away.",
    };
  }
}

export function submitBooking(payload) {
  return postJSON("/booking", payload);
}

export function submitContact(payload) {
  return postJSON("/contact", payload);
}

// ---------------- AUTH ----------------

export async function loginAdmin(username, password) {
  try {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        message: data?.detail || "Login failed.",
      };
    }

    return {
      ok: true,
      token: data.access_token,
    };
  } catch {
    return {
      ok: false,
      message: "Cannot reach server. Is the backend running?",
    };
  }
}

// ---------------- AUTH HEADERS ----------------

function authHeaders() {
  const token = localStorage.getItem("admin_token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

// ---------------- GALLERY ADMIN ----------------

export async function fetchGalleryImages() {
  try {
    const data = await getJSON("/gallery/images");
    return data.gallery ?? [];
  } catch {
    return [];
  }
}

export async function addGalleryImage(formData) {
  try {
    const res = await fetch(`${BASE}/gallery/images`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        message: data?.detail || "Upload failed.",
      };
    }

    return {
      ok: true,
      image: data.image,
    };
  } catch {
    return {
      ok: false,
      message: "Cannot reach server.",
    };
  }
}

export async function deleteGalleryImage(id) {
  try {
    const res = await fetch(
      `${BASE}/gallery/images/${id}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        message: data?.detail || "Delete failed.",
      };
    }

    return {
      ok: true,
    };
  } catch {
    return {
      ok: false,
      message: "Cannot reach server.",
    };
  }
}

// ---------------- FLEET ADMIN ----------------

export async function fetchFleetVehicles() {
  try {
    const data = await getJSON("/fleet/vehicles");
    return data.fleet ?? [];
  } catch {
    return [];
  }
}

export async function addFleetVehicle(formData) {
  try {
    const url = `${BASE}/fleet/vehicles`;

    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        message: data?.detail || "Upload failed.",
      };
    }

    return {
      ok: true,
      vehicle: data.vehicle,
    };
  } catch {
    return {
      ok: false,
      message: "Cannot reach server.",
    };
  }
}

export async function deleteFleetVehicle(id) {
  try {
    const url = `${BASE}/fleet/vehicles/${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: authHeaders(),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        message: data?.detail || "Delete failed.",
      };
    }

    return {
      ok: true,
    };
  } catch {
    return {
      ok: false,
      message: "Cannot reach server.",
    };
  }
}