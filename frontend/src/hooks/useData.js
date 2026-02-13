import { useState, useEffect, useCallback } from 'react';
import { transactionsAPI, analyticsAPI } from '../services/api';

// --- DATA FETCHING HOOKS ---

export const useTransactions = (initialParams = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, page_size: 20 });

  const fetchTransactions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const mergedParams = { ...initialParams, ...params };
      const response = await transactionsAPI.getTransactions(mergedParams);
      setTransactions(response.transactions);
      setPagination({ total: response.total, page: response.page, page_size: response.page_size });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(initialParams)]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  const refetch = (params) => fetchTransactions(params);
  return { transactions, loading, error, pagination, refetch };
};

export const useAnalyticsSummary = (params = {}) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getSummary(params);
      setSummary(response);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);
  return { summary, loading, error, refetch: fetchSummary };
};

export const useMonthlyTrend = (months = 6) => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const response = await analyticsAPI.getMonthlyTrend(months);
        setTrends(response.trends);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch trends');
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [months]);
  return { trends, loading, error };
};

export const useCategoryBreakdown = (params = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getCategoryBreakdown(params);
      setCategories(response.categories);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  return { categories, loading, error, refetch: fetchCategories };
};

export const useDailyTrend = (month, year) => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!month || !year) return;
      
      try {
        setLoading(true);
        const response = await analyticsAPI.getDailyTrend(month, year);
        const data = response.daily_data;
        
        setDailyData(data);
        
        // Check if there is actual data (non-zero income or expense)
        const totalActivity = data.reduce((acc, curr) => acc + curr.income + curr.expense, 0);
        setHasData(totalActivity > 0);
        
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch daily trends');
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year]);

  return { dailyData, loading, hasData, error };
};

// --- ACTION HOOKS (Upload, Update, Delete) ---

export const useUploadPDF = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const uploadPDF = async (file) => {
    try {
      setUploading(true);
      setProgress(0);
      setError(null);
      setResult(null);
      const response = await transactionsAPI.uploadPDF(file, (percent) => setProgress(percent));
      setResult(response);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to upload PDF';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setUploading(false);
    }
  };

  const reset = () => { setUploading(false); setProgress(0); setResult(null); setError(null); };
  return { uploadPDF, uploading, progress, result, error, reset };
};

export const useUpdateCategory = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateCategory = async (id, category) => {
    try {
      setUpdating(true);
      setError(null);
      await transactionsAPI.updateCategory(id, category);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update category';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setUpdating(false);
    }
  };
  return { updateCategory, updating, error };
};

export const useDeleteTransaction = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteTransaction = async (id) => {
    try {
      setDeleting(true);
      setError(null);
      await transactionsAPI.deleteTransaction(id);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to delete transaction';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setDeleting(false);
    }
  };
  return { deleteTransaction, deleting, error };
};