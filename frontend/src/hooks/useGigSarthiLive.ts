import { useState, useCallback } from "react";
import axios from "axios";

export function useGigSarthiLive() {
  const [loadingApi, setLoadingApi] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Predict Income state
  const [incomeResult, setIncomeResult] = useState<any>(null);
  
  // Best Work Time state
  const [timeResult, setTimeResult] = useState<any>(null);
  
  // Demand Alert state
  const [demandResult, setDemandResult] = useState<any>(null);
  
  // Dashboard overall state
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const handleApiError = (err: any) => {
    console.error("API Error:", err);
    setError(err.response?.data?.error || err.message || "An error occurred");
  };

  const predictIncome = useCallback(async (city: string, hoursWorked: string) => {
    if (!city || !hoursWorked) {
      setError("Please enter city and planned hours.");
      return;
    }
    setLoadingApi("income");
    setError(null);
    setIncomeResult(null);

    try {
      const response = await axios.post("/api/predict-income", {
        city,
        hours_worked: parseFloat(hoursWorked),
      });
      setIncomeResult(response.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoadingApi(null);
    }
  }, []);

  const fetchBestWorkTime = useCallback(async (city: string) => {
    if (!city) {
      setError("Please enter a city.");
      return;
    }
    setLoadingApi("time");
    setError(null);
    setTimeResult(null);

    try {
      const response = await axios.get(`/api/best-work-time?city=${city}`);
      setTimeResult(response.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoadingApi(null);
    }
  }, []);

  const fetchDemandAlert = useCallback(async (city: string) => {
    if (!city) {
      setError("Please enter a city.");
      return;
    }
    setLoadingApi("demand");
    setError(null);
    setDemandResult(null);

    try {
      const response = await axios.get(`/api/demand-alert?city=${city}`);
      setDemandResult(response.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoadingApi(null);
    }
  }, []);

  const fetchDashboardData = useCallback(async (city: string, hoursWorker: string = "8") => {
    setDashboardLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/dashboard?city=${city}&hours_worked=${hoursWorker}`);
      setDashboardData(response.data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  return {
    loadingApi,
    error,
    setError,
    incomeResult,
    timeResult,
    demandResult,
    dashboardData,
    dashboardLoading,
    predictIncome,
    fetchBestWorkTime,
    fetchDemandAlert,
    fetchDashboardData
  };
}
