document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Platform selector functionality
  const platformButtons = document.querySelectorAll(".platform-btn");
  const platformContents = document.querySelectorAll(".platform-content");

  platformButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const platform = button.dataset.platform;

      // Update button states
      platformButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update content visibility
      platformContents.forEach((content) => {
        if (content.dataset.platform === platform) {
          content.style.display = "block";
        } else {
          content.style.display = "none";
        }
      });
    });
  });

  // --- Fetch Latest Release and Stars from GitHub ---
  const macOSRepo = "floatpane/floatpane";
  const windowsRepo = "floatpane/floatpane-windows";
  const versionSpan = document.getElementById("latest-version");
  const installLink = document.getElementById("install-link");
  const windowsInstallLink = document.getElementById("windows-install-link");
  const starsSpan = document.getElementById("github-stars");

  async function fetchRepoInfo() {
    try {
      // Fetch macOS release info
      const macOSReleaseResponse = await fetch(
        `https://api.github.com/repos/${macOSRepo}/releases/latest`
      );
      if (macOSReleaseResponse.ok) {
        const releaseData = await macOSReleaseResponse.json();
        const latestVersion = releaseData.tag_name;
        const releaseUrl = releaseData.html_url;

        if (versionSpan) {
          versionSpan.textContent = latestVersion;
        }
        if (installLink) {
          installLink.href = releaseUrl;
        }
      }

      // Fetch Windows release info
      try {
        const windowsReleaseResponse = await fetch(
          `https://api.github.com/repos/${windowsRepo}/releases/latest`
        );
        if (windowsReleaseResponse.ok && windowsInstallLink) {
          const windowsReleaseData = await windowsReleaseResponse.json();
          windowsInstallLink.href = windowsReleaseData.html_url;
        }
      } catch (error) {
        console.log("Windows repo not found or accessible:", error);
      }

      // Fetch repo info for stars (using macOS repo)
      const repoResponse = await fetch(
        `https://api.github.com/repos/${macOSRepo}`
      );
      if (repoResponse.ok) {
        const repoData = await repoResponse.json();
        const starCount = repoData.stargazers_count;

        if (starsSpan) {
          starsSpan.textContent = starCount;
        }
      }
    } catch (error) {
      console.error("Could not fetch GitHub data:", error);
      if (versionSpan) {
        versionSpan.textContent = "N/A";
      }
      if (starsSpan) {
        starsSpan.textContent = "N/A";
      }
    }
  }

  fetchRepoInfo();

  // Interactive hover effects for feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.borderColor = "var(--accent)";
    });
    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.borderColor = "var(--border)";
    });
  });
});
// --- Initialize Clipboard.js ---
const clipboard = new ClipboardJS(".copy-btn");

clipboard.on("success", function (e) {
  const originalText = e.trigger.textContent;
  e.trigger.textContent = "Copied!";
  setTimeout(() => {
    e.trigger.textContent = originalText;
  }, 2000);
  e.clearSelection();
});

clipboard.on("error", function (e) {
  console.error("Action:", e.action);
  console.error("Trigger:", e.trigger);
  // You can add a fallback here, e.g., prompt the user to copy manually.
});
