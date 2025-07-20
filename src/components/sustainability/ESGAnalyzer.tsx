import { useState, useRef } from 'react';
import { Upload, BarChart3, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { openaiService } from '../../services/openaiService';
import ESGReportDisplay from './ESGReportDisplay';
import * as pdfjs from 'pdfjs-dist';

// Set up PDF.js worker - using exact version match
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const ESGAnalyzer = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      console.log('PDF.js version:', pdfjs.version);
      console.log('Worker URL:', pdfjs.GlobalWorkerOptions.workerSrc);
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
      }
      
      if (!fullText.trim()) {
        throw new Error('No text could be extracted from the PDF. Please ensure the PDF contains readable text.');
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      if (error instanceof Error && error.message.includes('API version')) {
        throw new Error('PDF processing library version mismatch. Please refresh the page and try again.');
      }
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const analyzeWithAI = async (extractedText: string, fileName: string): Promise<string> => {
    try {
      // Truncate text if too long (OpenAI has token limits)
      const maxLength = 8000; // Approximate character limit for context
      const truncatedText = extractedText.length > maxLength 
        ? extractedText.substring(0, maxLength) + "...[truncated]"
        : extractedText;

      const analysis = await openaiService.analyzeESGReport(truncatedText, fileName);
      return analysis;
    } catch (error) {
      console.error('AI Analysis error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to analyze report with AI. Please check your internet connection and try again.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only.');
        setUploadedFile(null);
        return;
      }

      // Check file size (200MB limit)
      const maxSize = 200 * 1024 * 1024; // 200MB in bytes
      if (file.size > maxSize) {
        setError('File size must be less than 200MB. Please upload a smaller file.');
        setUploadedFile(null);
        return;
      }
      
      setUploadedFile(file);
      setError(null);
      analyzeESGReport(file);
    }
  };

  const analyzeESGReport = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      // Step 1: Extract text from PDF
      const extractedText = await extractTextFromPDF(file);
      
      // Step 2: Analyze with AI
      const analysis = await analyzeWithAI(extractedText, file.name);
      
      setAnalysisResult(analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze the ESG report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = (content: string) => {
    const lines = content.split('\n');
    const formattedContent: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) {
        formattedContent.push(<div key={index} className="h-3" />);
        return;
      }
      
      // Main headers (##)
      if (trimmedLine.startsWith('## ')) {
        const headerText = trimmedLine.replace('## ', '');
        
        // Map headers to icons
        const getHeaderIcon = (header: string) => {
          if (header.toLowerCase().includes('executive')) return '📋';
          if (header.toLowerCase().includes('environmental')) return '🌱';
          if (header.toLowerCase().includes('social')) return '👥';
          if (header.toLowerCase().includes('governance')) return '⚖️';
          if (header.toLowerCase().includes('rating')) return '⭐';
          if (header.toLowerCase().includes('recommendation')) return '💡';
          if (header.toLowerCase().includes('risk')) return '⚠️';
          return '📊';
        };
        
        formattedContent.push(
          <div key={index} className="mt-8 mb-6 first:mt-0">
            <div className="bg-white border border-berlin-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{getHeaderIcon(headerText)}</span>
                <h3 className="text-2xl font-bold text-berlin-gray-900 tracking-tight">{headerText}</h3>
              </div>
              <div className="border-b border-berlin-gray-200 w-full"></div>
            </div>
          </div>
        );
        return;
      }
      
      // Score lines with professional card design
      if (trimmedLine.includes('Score:') && trimmedLine.includes('/10')) {
        const scoreMatch = trimmedLine.match(/Score: ([0-9]+(?:\.[0-9]+)?)\/10/);
        const score = scoreMatch ? parseFloat(scoreMatch[1]) : 0;
        const justification = trimmedLine.replace(/Score: [0-9]+(?:\.[0-9]+)?\/10 with specific justification: /, '');
        
        const getScoreColor = (score: number) => {
          if (score >= 9) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', scoreText: 'text-emerald-600' };
          if (score >= 7) return { bg: 'bg-berlin-red-50', border: 'border-berlin-red-200', text: 'text-berlin-red-700', scoreText: 'text-berlin-red-600' };
          if (score >= 5) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', scoreText: 'text-yellow-600' };
          if (score >= 3) return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', scoreText: 'text-orange-600' };
          return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', scoreText: 'text-red-600' };
        };
        
        const colors = getScoreColor(score);
        
        formattedContent.push(
          <div key={index} className={`${colors.bg} ${colors.border} border rounded-lg p-6 my-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`${colors.scoreText} bg-white rounded-full w-16 h-16 flex items-center justify-center border-2 ${colors.border} shadow-sm`}>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{score % 1 === 0 ? Math.round(score) : score.toFixed(1)}</div>
                    <div className="text-xs opacity-75">/10</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-berlin-gray-500 uppercase tracking-wide">Assessment Score</div>
                  <div className={`text-lg font-semibold ${colors.text}`}>
                    {score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : score >= 4 ? 'Fair' : 'Needs Improvement'}
                  </div>
                </div>
              </div>
            </div>
            <div className={`${colors.text} text-sm leading-relaxed bg-white bg-opacity-50 rounded-md p-4`}>
              {justification}
            </div>
          </div>
        );
        return;
      }
      
      // Skip lines that start with "- Score:" to avoid duplication
      if (trimmedLine.startsWith('- Score:')) {
        return;
      }
      
      // Skip any other score-related bullet points
      if (trimmedLine.match(/^- .*Score: [0-9]+(?:\.[0-9]+)?\/10/)) {
        return;
      }
      
      // Letter grade with executive summary style
      if (trimmedLine.includes('Letter grade') || trimmedLine.match(/^[A-F][+-]?/)) {
        const gradeMatch = trimmedLine.match(/([A-F][+-]?)/);
        if (gradeMatch) {
          const grade = gradeMatch[1];
          const description = trimmedLine.replace(/Letter grade \([A-F][+-]? to [A-F]\) with rationale: /, '').replace(/^[A-F][+-]? /, '');
          
          const getGradeInfo = (grade: string) => {
            if (grade.startsWith('A')) return { 
              color: 'text-emerald-600', 
              bg: 'bg-emerald-50', 
              border: 'border-emerald-200',
              label: 'Outstanding',
              description: 'Industry leading ESG performance'
            };
            if (grade.startsWith('B')) return { 
              color: 'text-blue-600', 
              bg: 'bg-blue-50', 
              border: 'border-blue-200',
              label: 'Strong',
              description: 'Above average ESG performance'
            };
            if (grade.startsWith('C')) return { 
              color: 'text-yellow-600', 
              bg: 'bg-yellow-50', 
              border: 'border-yellow-200',
              label: 'Adequate',
              description: 'Average ESG performance'
            };
            return { 
              color: 'text-red-600', 
              bg: 'bg-red-50', 
              border: 'border-red-200',
              label: 'Needs Improvement',
              description: 'Below average ESG performance'
            };
          };
          
          const gradeInfo = getGradeInfo(grade);
          
          formattedContent.push(
            <div key={index} className={`${gradeInfo.bg} ${gradeInfo.border} border rounded-lg p-8 my-6 shadow-lg`}>
              <div className="text-center">
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className={`${gradeInfo.color} bg-white rounded-full w-24 h-24 flex items-center justify-center border-2 ${gradeInfo.border} shadow-md`}>
                    <span className="text-4xl font-bold">{grade}</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-berlin-gray-500 uppercase tracking-wide mb-1">Overall ESG Rating</div>
                    <div className={`text-2xl font-bold ${gradeInfo.color} mb-2`}>{gradeInfo.label}</div>
                    <div className="text-berlin-gray-600 text-sm">{gradeInfo.description}</div>
                  </div>
                </div>
                <div className="bg-white bg-opacity-70 rounded-md p-4 text-berlin-gray-700 text-sm leading-relaxed">
                  {description}
                </div>
              </div>
            </div>
          );
          return;
        }
      }
      
      // Professional bullet points
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        const listText = trimmedLine.replace(/^[-•] /, '');
        formattedContent.push(
          <div key={index} className="bg-white border border-berlin-gray-100 rounded-md p-4 my-2 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-berlin-gray-700 text-sm leading-relaxed">{listText}</p>
            </div>
          </div>
        );
        return;
      }
      
      // Professional numbered lists
      if (trimmedLine.match(/^\d+\./)) {
        const numberMatch = trimmedLine.match(/^(\d+)\. (.+)/);
        if (numberMatch) {
          const [, number, text] = numberMatch;
          formattedContent.push(
            <div key={index} className="bg-white border border-berlin-gray-100 rounded-md p-4 my-2 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="bg-blue-600 text-white rounded-md w-7 h-7 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {number}
                </span>
                <p className="text-berlin-gray-700 text-sm leading-relaxed pt-1">{text}</p>
              </div>
            </div>
          );
          return;
        }
      }
      
      // Regular paragraphs with professional styling
      const formattedLine = trimmedLine
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-berlin-gray-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-berlin-gray-700">$1</em>');
        
      formattedContent.push(
        <div key={index} className="my-3">
          <p className="text-berlin-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        </div>
      );
    });
    
    return formattedContent;
  };

  const resetAnalysis = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-berlin-gray-200 shadow-lg p-8">
      <div className="text-center mb-8">
        <BarChart3 className="w-16 h-16 text-berlin-red-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-berlin-gray-900 mb-2">AI-Powered Sustainability Report Analysis</h2>
        <p className="text-berlin-gray-600">Upload your PDF report for comprehensive AI-driven sustainability analysis and insights</p>
      </div>

      {!uploadedFile && !analysisResult && !error ? (
        <div className="border-2 border-dashed border-berlin-gray-300 rounded-xl p-12 text-center hover:border-berlin-red-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload className="w-12 h-12 text-berlin-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-berlin-gray-900 mb-2">Upload Sustainability Report</h3>
          <p className="text-berlin-gray-600 mb-4">Drop your PDF file here or click to browse</p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-berlin-red-600 hover:bg-berlin-red-700 mx-auto"
          >
            Choose PDF File
          </Button>
          <div className="mt-4 text-xs text-berlin-gray-500">
            <p>Supported format: PDF • Max size: 200MB</p>
            <p>AI will analyze environmental, social, and governance metrics</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Analysis Error</h3>
          <p className="text-red-600 mb-6 max-w-md mx-auto">{error}</p>
          <Button
            onClick={resetAnalysis}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 text-berlin-red-600 mb-4">
            <div className="w-8 h-8 border-2 border-berlin-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium">Analyzing Sustainability Report with AI...</span>
          </div>
          <div className="space-y-2 text-berlin-gray-500 max-w-md mx-auto">
            <p>📄 Extracting text from PDF document</p>
            <p>🤖 AI analyzing environmental metrics</p>
            <p>📊 Evaluating social and governance factors</p>
            <p>📈 Generating specific insights and recommendations</p>
          </div>
          <p className="text-sm text-berlin-gray-400 mt-4">This process may take 30-90 seconds depending on document size</p>
        </div>
      ) : analysisResult ? (
        <ESGReportDisplay 
          analysisResult={analysisResult}
          fileName={uploadedFile?.name || 'Sustainability Report'}
          onReset={resetAnalysis}
        />
      ) : null}
    </div>
  );
};

export default ESGAnalyzer;