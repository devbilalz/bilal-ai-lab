"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getFallbackSunProgress,
  getSolarSunProgress,
  getTimePhase,
  getSolarTimePhase,
  resolveSunProgress,
  resolvePhase,
  resolveTheme,
  THEME_MODE_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeMode,
  type TimePhase,
} from "@/lib/theme-time";
import {
  fetchLocalWeather,
  type LocalWeather,
  type LocalWeatherStatus,
} from "@/lib/local-weather";

/**
 * Site-level theme runtime. It keeps the framework class (`dark` / `light`)
 * and the atmospheric phase (`morning` / `day` / `evening` / `night`) in sync.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <ThemeRuntime>{children}</ThemeRuntime>;
}

interface ThemeRuntimeValue {
  mode: ThemeMode;
  phase: TimePhase;
  resolvedTheme: ResolvedTheme;
  sunProgress: number;
  simulationEnabled: boolean;
  simulatedTime: Date | null;
  weather: LocalWeather | null;
  weatherStatus: LocalWeatherStatus;
  requestLocalWeather: () => void;
  toggleTimeSimulation: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeRuntimeContext = createContext<ThemeRuntimeValue | null>(null);

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "night";
  const value = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
  if (value === "dark") return "night";
  if (value === "light") return "day";
  return value === "auto" ||
    value === "morning" ||
    value === "day" ||
    value === "evening" ||
    value === "night"
    ? value
    : "night";
}

function ThemeRuntime({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("night");
  const [clockNow, setClockNow] = useState<Date>(() => new Date());
  const [clockPhase, setClockPhase] = useState<TimePhase>("night");
  const [simulationEnabled, setSimulationEnabled] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState<Date | null>(null);
  const [weather, setWeather] = useState<LocalWeather | null>(null);
  const [weatherStatus, setWeatherStatus] = useState<LocalWeatherStatus>("idle");

  useEffect(() => {
    const syncBrowserTheme = () => {
      setModeState(readStoredMode());
      const now = new Date();
      setClockNow(now);
      setClockPhase(getTimePhase(now));
    };

    const frame = window.requestAnimationFrame(syncBrowserTheme);
    const id = window.setInterval(syncBrowserTheme, 60_000);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!simulationEnabled) return;

    const tick = () => {
      setSimulatedTime((current) => {
        const base = current ?? new Date();
        const next = new Date(base);
        next.setHours((base.getHours() + 1) % 24, 0, 0, 0);
        return next;
      });
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [simulationEnabled]);

  const effectiveNow = simulatedTime ?? clockNow;

  const autoPhase = weather
    ? getSolarTimePhase({
        now: effectiveNow,
        sunriseAt: weather.sunriseAt,
        sunsetAt: weather.sunsetAt,
      })
    : simulationEnabled
      ? getTimePhase(effectiveNow)
      : clockPhase;
  const clockProgress = getFallbackSunProgress(effectiveNow);
  const solarProgress = weather
    ? getSolarSunProgress({
        now: effectiveNow,
        sunriseAt: weather.sunriseAt,
        sunsetAt: weather.sunsetAt,
      })
    : null;
  const sunProgress = resolveSunProgress({
    mode,
    clockProgress,
    solarProgress,
  });

  const phase = resolvePhase(mode, autoPhase);
  const resolvedTheme = resolveTheme(mode, autoPhase);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.classList.toggle("light", resolvedTheme === "light");
    root.dataset.themeMode = mode;
    root.dataset.timePhase = phase;
    root.dataset.resolvedTheme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
  }, [mode, phase, resolvedTheme]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_MODE_STORAGE_KEY) {
        setModeState(readStoredMode());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const refreshWeather = useCallback(
    async (position: GeolocationPosition) => {
      setWeatherStatus("loading");
      try {
        const nextWeather = await fetchLocalWeather({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setWeather(nextWeather);
        setWeatherStatus("ready");
      } catch {
        setWeatherStatus("error");
      }
    },
    [],
  );

  const requestLocalWeather = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setWeatherStatus("unsupported");
      return;
    }

    setWeatherStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void refreshWeather(position);
      },
      (error) => {
        setWeatherStatus(error.code === error.PERMISSION_DENIED ? "denied" : "error");
      },
      {
        enableHighAccuracy: false,
        maximumAge: 30 * 60 * 1000,
        timeout: 10_000,
      },
    );
  }, [refreshWeather]);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      const frame = window.requestAnimationFrame(() => setWeatherStatus("unsupported"));
      return () => window.cancelAnimationFrame(frame);
    }

    if (!navigator.permissions?.query) {
      const frame = window.requestAnimationFrame(() => setWeatherStatus("needs-permission"));
      return () => window.cancelAnimationFrame(frame);
    }

    let cancelled = false;
    let permissionStatus: PermissionStatus | null = null;

    navigator.permissions
      .query({ name: "geolocation" })
      .then((status) => {
        if (cancelled) return;

        permissionStatus = status;
        const syncStatus = () => {
          if (status.state === "granted") {
            requestLocalWeather();
          } else {
            setWeatherStatus(status.state === "denied" ? "denied" : "needs-permission");
          }
        };

        syncStatus();
        status.onchange = syncStatus;
      })
      .catch(() => {
        if (!cancelled) setWeatherStatus("needs-permission");
      });

    return () => {
      cancelled = true;
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, [requestLocalWeather]);

  const setMode = useCallback((nextMode: ThemeMode) => {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, nextMode);
    setModeState(nextMode);
  }, []);

  const toggleTimeSimulation = useCallback(() => {
    setSimulationEnabled((enabled) => {
      const next = !enabled;
      if (next) {
        window.localStorage.setItem(THEME_MODE_STORAGE_KEY, "auto");
        setModeState("auto");
        const start = new Date();
        start.setHours(23, 0, 0, 0);
        setSimulatedTime(start);
      } else {
        setSimulatedTime(null);
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      phase,
      resolvedTheme,
      sunProgress,
      simulationEnabled,
      simulatedTime,
      weather,
      weatherStatus,
      requestLocalWeather,
      toggleTimeSimulation,
      setMode,
    }),
    [
      mode,
      phase,
      resolvedTheme,
      sunProgress,
      simulationEnabled,
      simulatedTime,
      weather,
      weatherStatus,
      requestLocalWeather,
      toggleTimeSimulation,
      setMode,
    ],
  );

  return (
    <ThemeRuntimeContext.Provider value={value}>
      {children}
    </ThemeRuntimeContext.Provider>
  );
}

export function useThemeRuntime() {
  const value = useContext(ThemeRuntimeContext);
  if (!value) {
    throw new Error("useThemeRuntime must be used inside ThemeProvider");
  }
  return value;
}
