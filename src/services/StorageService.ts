import { SwingAnalysisResult } from './AnalysisService';

class StorageService {
  private readonly STORAGE_KEY = 'swingai_analysis_results';
  
  // Save analysis results to local storage
  saveAnalysisResults(results: SwingAnalysisResult[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Error saving analysis results to local storage:', error);
    }
  }
  
  // Load analysis results from local storage
  loadAnalysisResults(): SwingAnalysisResult[] {
    try {
      const storedResults = localStorage.getItem(this.STORAGE_KEY);
      return storedResults ? JSON.parse(storedResults) : [];
    } catch (error) {
      console.error('Error loading analysis results from local storage:', error);
      return [];
    }
  }
  
  // Save a single analysis result
  saveAnalysisResult(result: SwingAnalysisResult): void {
    try {
      const existingResults = this.loadAnalysisResults();
      const updatedResults = [result, ...existingResults.filter(r => r.id !== result.id)];
      this.saveAnalysisResults(updatedResults);
    } catch (error) {
      console.error('Error saving analysis result to local storage:', error);
    }
  }
  
  // Delete an analysis result
  deleteAnalysisResult(id: string): void {
    try {
      const existingResults = this.loadAnalysisResults();
      const updatedResults = existingResults.filter(result => result.id !== id);
      this.saveAnalysisResults(updatedResults);
    } catch (error) {
      console.error('Error deleting analysis result from local storage:', error);
    }
  }
  
  // Clear all analysis results
  clearAnalysisResults(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing analysis results from local storage:', error);
    }
  }
}

export default new StorageService();