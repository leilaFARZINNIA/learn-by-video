import { useTheme } from "../../context/ThemeContext";

export function useGradients() {
  const { colors } = useTheme();
  const dashboard = (colors as any).dashboardColors;

  const pickRandomGradient = () => {
    const pool = dashboard.gradientPool;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  return {
    gradientsByType: dashboard.gradientsByType,
    pickRandomGradient,
  };
}
