(() => {
  const CONTENT_URL = "/content/site-content.json";
  const ROUTES = {
    "/about": renderAbout,
    "/schedule-results": renderScheduleResults
  };

  const root = document.getElementById("root");
  if (!root) {
    return;
  }

  let contentCache = null;
  let contentPromise = null;

  const normalizePath = (path) => {
    const trimmed = path.replace(/\/+$/, "");
    return trimmed === "" ? "/" : trimmed;
  };

  const loadContent = async () => {
    if (contentCache) {
      return contentCache;
    }
    if (!contentPromise) {
      contentPromise = fetch(CONTENT_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load content");
          }
          return response.json();
        })
        .then((data) => {
          contentCache = data;
          return data;
        })
        .catch((error) => {
          console.error("Content load error:", error);
          return null;
        });
    }
    return contentPromise;
  };

  const createElement = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text) {
      element.textContent = text;
    }
    if (className) {
      element.className = className;
    }
    return element;
  };

  const clearRoot = () => {
    root.innerHTML = "";
  };

  function renderAbout(content) {
    const about = content.about;
    if (!about) {
      return;
    }

    clearRoot();

    const container = createElement("section", null, "content-section");
    container.appendChild(createElement("h1", about.title));
    container.appendChild(createElement("p", about.lead));

    if (Array.isArray(about.principles)) {
      const list = createElement("ul", null, "content-list");
      about.principles.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.appendChild(createElement("strong", item.title));
        listItem.appendChild(createElement("p", item.body));
        list.appendChild(listItem);
      });
      container.appendChild(createElement("h2", "理念の柱"));
      container.appendChild(list);
    }

    if (Array.isArray(about.history)) {
      const historyWrapper = createElement("div", null, "content-history");
      historyWrapper.appendChild(createElement("h2", "沿革"));
      about.history.forEach((entry) => {
        const row = createElement("p", `${entry.year} - ${entry.detail}`);
        historyWrapper.appendChild(row);
      });
      container.appendChild(historyWrapper);
    }

    root.appendChild(container);
  }

  function renderScheduleResults(content) {
    const schedule = content.scheduleResults;
    if (!schedule) {
      return;
    }

    clearRoot();

    const container = createElement("section", null, "content-section");
    container.appendChild(createElement("h1", schedule.title));

    if (schedule.updated) {
      container.appendChild(createElement("p", `更新日: ${schedule.updated}`));
    }

    if (Array.isArray(schedule.seasons)) {
      schedule.seasons.forEach((season) => {
        container.appendChild(createElement("h2", `${season.year}年`));
        const table = document.createElement("table");
        const headerRow = document.createElement("tr");
        ["日付", "大会名", "会場", "結果", "備考"].forEach((label) => {
          headerRow.appendChild(createElement("th", label));
        });
        table.appendChild(headerRow);

        (season.matches || []).forEach((match) => {
          const row = document.createElement("tr");
          [match.date, match.name, match.location, match.result, match.note].forEach((value) => {
            row.appendChild(createElement("td", value || ""));
          });
          table.appendChild(row);
        });

        container.appendChild(table);
      });
    }

    if (schedule.note) {
      container.appendChild(createElement("p", schedule.note));
    }

    root.appendChild(container);
  }

  const renderForRoute = async () => {
    const path = normalizePath(window.location.pathname);
    const renderer = ROUTES[path];
    if (!renderer) {
      return;
    }
    const content = await loadContent();
    if (!content) {
      return;
    }
    renderer(content);
  };

  const scheduleRender = () => {
    window.requestAnimationFrame(() => {
      renderForRoute();
    });
  };

  const patchHistory = (methodName) => {
    const original = window.history[methodName];
    window.history[methodName] = function patchedHistory(...args) {
      const result = original.apply(this, args);
      scheduleRender();
      return result;
    };
  };

  patchHistory("pushState");
  patchHistory("replaceState");
  window.addEventListener("popstate", scheduleRender);
  window.addEventListener("DOMContentLoaded", scheduleRender);
  scheduleRender();
})();
