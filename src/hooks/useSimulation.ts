import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { runSimulationTick } from "../thunks/simulationThunk";

export function useSimulation() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(runSimulationTick());
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [dispatch]);
}
