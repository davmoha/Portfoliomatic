import { PortfolioData } from '../types/portfolio';

/**
 * Exports the current portfolio configuration as a portable JSON project file.
 * Allows users to backup and restore their work with zero database overhead.
 */
export function exportProjectFile(portfolio: PortfolioData): void {
  const jsonString = JSON.stringify(portfolio, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  const fileName = `${(portfolio.githubUsername || 'my').toLowerCase()}-portfolio.json`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imports and validates a saved portfolio JSON project file.
 */
export function importProjectFile(file: File): Promise<PortfolioData> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.json')) {
      return reject(new Error('Please select a valid .json project file.'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        // Basic structural validation
        if (!parsed.fullName && !parsed.githubUsername) {
          throw new Error('Invalid project file format: missing required portfolio data.');
        }

        resolve(parsed as PortfolioData);
      } catch (err: any) {
        reject(new Error(`Failed to read project file: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read the selected file.'));
    reader.readAsText(file);
  });
}
