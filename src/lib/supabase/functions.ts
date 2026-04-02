import { supabase } from "@/lib/supabase/client";

const careerSimulatorFunctionName =
  import.meta.env.VITE_SUPABASE_CAREER_SIMULATOR_FUNCTION || "career-simulator";

export const careerSimulatorService = {
  async invoke(payload: Record<string, unknown>) {
    const { data, error } = await supabase.functions.invoke(careerSimulatorFunctionName, {
      body: payload,
    });

    if (error) {
      console.error("Error invoking career simulator:", error);
      throw new Error(error.message || "Could not reach the Supabase career simulator.");
    }

    return data;
  },
};
