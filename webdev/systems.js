// Decorative footage: respect reduced motion and play only one visible clip.
const systemsVideos = [...document.querySelectorAll(".systems-video")];
const systemsMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const systemsVisibility = new Map(systemsVideos.map((video) => [video, 0]));

function updateSystemsPlayback() {
  const candidates = systemsVideos.filter(
    (video) => systemsVisibility.get(video) >= 0.25,
  );
  const active =
    systemsMotion.matches || document.hidden
      ? null
      : candidates.sort(
          (a, b) => systemsVisibility.get(b) - systemsVisibility.get(a),
        )[0];

  for (const video of systemsVideos) {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.autoplay = video === active;
    if (video === active) {
      video.play().catch(() => {}); // A browser may require interaction; retain the poster.
    } else {
      video.pause();
      if (systemsMotion.matches && video.readyState > 0) video.currentTime = 0;
    }
  }
}

const systemsObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries)
      systemsVisibility.set(entry.target, entry.intersectionRatio);
    updateSystemsPlayback();
  },
  { threshold: [0, 0.25, 0.5, 0.75, 1] },
);

for (const video of systemsVideos) {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  systemsObserver.observe(video);
}
systemsMotion.addEventListener("change", updateSystemsPlayback);
document.addEventListener("visibilitychange", updateSystemsPlayback);
updateSystemsPlayback();
