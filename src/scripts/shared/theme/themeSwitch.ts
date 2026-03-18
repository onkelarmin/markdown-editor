export function initThemeSwitch() {
  const root = document.documentElement;
  const themeSwitch = document.querySelector<HTMLInputElement>(
    ".theme-switch > input",
  );

  if (!themeSwitch) throw new Error("Theme switch missing in DOM");

  const storageKey = "theme-preference";

  type Theme = "light" | "dark";

  let theme = root.dataset.theme as Theme;

  const handleThemeChange = () => {
    setLocalStorage();
    if (!document.startViewTransition) {
      updateUI();
      return;
    }

    document.startViewTransition(() => {
      updateUI();
    });
  };

  const updateUI = () => {
    root.dataset.theme = theme;
    updateThemeSwitch();
  };

  const setLocalStorage = () => {
    localStorage.setItem(storageKey, theme);
  };

  const updateThemeSwitch = () => {
    themeSwitch.checked = theme === "dark" ? true : false;
  };

  themeSwitch.addEventListener("change", () => {
    theme = theme === "dark" ? "light" : "dark";
    handleThemeChange();
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      theme = e.matches ? "dark" : "light";
      handleThemeChange();
    });

  updateThemeSwitch();
}
