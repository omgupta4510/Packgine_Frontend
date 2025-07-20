import { useState } from 'react';
import { 
  FileText, 
  Leaf, 
  Users, 
  Shield, 
  Star, 
  Lightbulb, 
  AlertTriangle,
  ChevronRight,
  Award
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ESGReportDisplayProps {
  analysisResult: string;
  fileName: string;
  onReset: () => void;
}

interface ESGSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const ESGReportDisplay = ({ analysisResult, fileName, onReset }: ESGReportDisplayProps) => {
  const [activeSection, setActiveSection] = useState<string>('executive');

  // Parse the analysis result into sections
  const parseAnalysisIntoSections = (analysis: string): ESGSection[] => {
    const sections: ESGSection[] = [];
    
    // Split by ## headers
    const parts = analysis.split(/## /);
    
    parts.forEach((part, index) => {
      if (index === 0 && !part.trim().startsWith('Executive')) return; // Skip empty first part
      
      const lines = part.trim().split('\n');
      const title = lines[0];
      const content = lines.slice(1).join('\n').trim();
      
      if (title && content) {
        const sectionConfig = getSectionConfig(title);
        sections.push({
          id: sectionConfig.id,
          title: sectionConfig.title,
          icon: sectionConfig.icon,
          content: content,
          color: sectionConfig.color,
          bgColor: sectionConfig.bgColor,
          borderColor: sectionConfig.borderColor
        });
      }
    });
    
    return sections;
  };

  const getSectionConfig = (title: string) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('executive')) {
      return {
        id: 'executive',
        title: 'Executive Summary',
        icon: <FileText className="w-5 h-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
    }
    
    if (titleLower.includes('environmental')) {
      return {
        id: 'environmental',
        title: 'Environmental Impact',
        icon: <Leaf className="w-5 h-5" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
    }
    
    if (titleLower.includes('social')) {
      return {
        id: 'social',
        title: 'Social Responsibility',
        icon: <Users className="w-5 h-5" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      };
    }
    
    if (titleLower.includes('governance')) {
      return {
        id: 'governance',
        title: 'Governance',
        icon: <Shield className="w-5 h-5" />,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200'
      };
    }
    
    if (titleLower.includes('rating')) {
      return {
        id: 'rating',
        title: 'Overall ESG Rating',
        icon: <Star className="w-5 h-5" />,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      };
    }
    
    if (titleLower.includes('recommendation')) {
      return {
        id: 'recommendations',
        title: 'Recommendations',
        icon: <Lightbulb className="w-5 h-5" />,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    }
    
    if (titleLower.includes('risk')) {
      return {
        id: 'risk',
        title: 'Risk Assessment',
        icon: <AlertTriangle className="w-5 h-5" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };
    }
    
    // Default case
    return {
      id: 'other',
      title: title,
      icon: <FileText className="w-5 h-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    };
  };

  const sections = parseAnalysisIntoSections(analysisResult);
  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

  const extractScoreFromContent = (content: string): { score: number; justification: string } | null => {
    // Look for patterns like "Score: 8/10" or "Score: 8.5/10 with justification: ..."
    const scoreMatch = content.match(/Score:\s*([0-9]+(?:\.[0-9]+)?)\/10(?:\s*with\s*(?:specific\s*)?justification:?)?\s*(.*?)$/s);
    if (scoreMatch) {
      return {
        score: parseFloat(scoreMatch[1]),
        justification: scoreMatch[2].trim()
      };
    }
    return null;
  };

  const extractGradeFromContent = (content: string): string | null => {
    const gradeMatch = content.match(/Letter grade[:\s]*([A-F][+-]?)/i);
    return gradeMatch ? gradeMatch[1] : null;
  };

  const formatSectionContent = (content: string, sectionId: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const formattedLines: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) return;
      
      // Handle score display
      if (trimmedLine.includes('Score:') && trimmedLine.includes('/10')) {
        const scoreData = extractScoreFromContent(trimmedLine);
        if (scoreData) {
          const getScoreColor = (score: number) => {
            if (score >= 8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            if (score >= 6) return 'text-blue-600 bg-blue-50 border-blue-200';
            if (score >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            return 'text-red-600 bg-red-50 border-red-200';
          };

          const getScoreLabel = (score: number) => {
            if (score >= 8) return 'Excellent';
            if (score >= 6) return 'Good';
            if (score >= 4) return 'Fair';
            return 'Needs Improvement';
          };

          formattedLines.push(
            <div key={index} className={`${getScoreColor(scoreData.score)} border rounded-xl p-8 my-6 w-full bg-white shadow-lg`}>
              <div className="flex items-center gap-6 mb-6">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center border-2 shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{scoreData.score}</div>
                    <div className="text-sm opacity-75">/10</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium opacity-75 uppercase tracking-wide mb-1">Assessment Score</div>
                  <div className="text-2xl font-semibold">{getScoreLabel(scoreData.score)}</div>
                </div>
              </div>
              
            </div>
          );
        }
        return;
      }

      // Handle letter grade in bullet points first (most common format)
      if (sectionId === 'rating' && (trimmedLine.includes('Letter Grade:') || trimmedLine.includes('Letter grade:'))) {
        const gradeMatch = trimmedLine.match(/Letter [Gg]rade:\s*([A-F][+-]?)/i);
        if (gradeMatch) {
          const grade = gradeMatch[1];
          const getGradeInfo = (grade: string) => {
            if (grade.startsWith('A')) return { 
              color: 'text-emerald-600', 
              bg: 'bg-emerald-50', 
              border: 'border-emerald-200',
              label: 'Outstanding'
            };
            if (grade.startsWith('B')) return { 
              color: 'text-blue-600', 
              bg: 'bg-blue-50', 
              border: 'border-blue-200',
              label: 'Strong'
            };
            if (grade.startsWith('C')) return { 
              color: 'text-yellow-600', 
              bg: 'bg-yellow-50', 
              border: 'border-yellow-200',
              label: 'Adequate'
            };
            return { 
              color: 'text-red-600', 
              bg: 'bg-red-50', 
              border: 'border-red-200',
              label: 'Needs Improvement'
            };
          };

          const gradeInfo = getGradeInfo(grade);

          formattedLines.push(
            <div key={index} className={`${gradeInfo.bg} ${gradeInfo.border} border rounded-xl p-8 my-6 w-full bg-white shadow-lg`}>
              <div className="flex items-center gap-6 mb-6">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center border-2 shadow-lg">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${gradeInfo.color}`}>{grade}</div>
                    <div className="text-xs opacity-75">Grade</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium opacity-75 uppercase tracking-wide mb-1">ESG Rating</div>
                  <div className={`text-2xl font-semibold ${gradeInfo.color}`}>{gradeInfo.label}</div>
                </div>
              </div>
            </div>
          );
        }
        return;
      }

      // Handle grade display (alternative format)
      if (sectionId === 'rating' && (trimmedLine.includes('Letter grade') || trimmedLine.match(/^[A-F][+-]?/))) {
        const grade = extractGradeFromContent(trimmedLine);
        if (grade) {
          const getGradeInfo = (grade: string) => {
            if (grade.startsWith('A')) return { 
              color: 'text-emerald-600', 
              bg: 'bg-emerald-50', 
              border: 'border-emerald-200',
              label: 'Outstanding'
            };
            if (grade.startsWith('B')) return { 
              color: 'text-blue-600', 
              bg: 'bg-blue-50', 
              border: 'border-blue-200',
              label: 'Strong'
            };
            if (grade.startsWith('C')) return { 
              color: 'text-yellow-600', 
              bg: 'bg-yellow-50', 
              border: 'border-yellow-200',
              label: 'Adequate'
            };
            return { 
              color: 'text-red-600', 
              bg: 'bg-red-50', 
              border: 'border-red-200',
              label: 'Needs Improvement'
            };
          };

          const gradeInfo = getGradeInfo(grade);

          formattedLines.push(
            <div key={index} className={`${gradeInfo.bg} ${gradeInfo.border} border rounded-xl p-10 my-8 text-center w-full bg-white shadow-lg`}>
              <div className="flex items-center justify-center gap-8 mb-6">
                <Award className={`w-16 h-16 ${gradeInfo.color}`} />
                <div>
                  <div className={`text-6xl font-bold ${gradeInfo.color} mb-2`}>{grade}</div>
                  <div className={`text-2xl font-semibold ${gradeInfo.color}`}>{gradeInfo.label}</div>
                </div>
              </div>
              <div className="text-base text-gray-700 leading-relaxed">
                {(() => {
                  const processGradeText = (text: string): React.ReactNode[] => {
                    const cleanText = text.replace(/Letter grade[:\s]*[A-F][+-]?\s*/i, '');
                    const parts: React.ReactNode[] = [];
                    let currentText = cleanText;
                    let key = 0;
                    
                    // Process **bold** text
                    while (currentText.includes('**')) {
                      const startIndex = currentText.indexOf('**');
                      if (startIndex === -1) break;
                      
                      const endIndex = currentText.indexOf('**', startIndex + 2);
                      if (endIndex === -1) break;
                      
                      // Add text before bold
                      if (startIndex > 0) {
                        parts.push(currentText.substring(0, startIndex));
                      }
                      
                      // Add bold text
                      const boldText = currentText.substring(startIndex + 2, endIndex);
                      parts.push(
                        <strong key={key++} className="font-semibold text-gray-900">
                          {boldText}
                        </strong>
                      );
                      
                      // Continue with remaining text
                      currentText = currentText.substring(endIndex + 2);
                    }
                    
                    // Add any remaining text
                    if (currentText.trim()) {
                      parts.push(currentText);
                    }
                    
                    return parts;
                  };
                  
                  return processGradeText(trimmedLine);
                })()}
              </div>
            </div>
          );
        }
        return;
      }

      // Handle bullet points (but skip letter grade lines)
      if ((trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) && 
          !trimmedLine.includes('Letter Grade:') && !trimmedLine.includes('Letter grade:')) {
        const bulletText = trimmedLine.replace(/^[-•] /, '');
        
        // Process bold text in bullet points
        const processBulletText = (text: string): React.ReactNode[] => {
          const parts: React.ReactNode[] = [];
          let currentText = text;
          let key = 0;
          
          // Process **bold** text
          while (currentText.includes('**')) {
            const startIndex = currentText.indexOf('**');
            if (startIndex === -1) break;
            
            const endIndex = currentText.indexOf('**', startIndex + 2);
            if (endIndex === -1) break;
            
            // Add text before bold
            if (startIndex > 0) {
              parts.push(currentText.substring(0, startIndex));
            }
            
            // Add bold text
            const boldText = currentText.substring(startIndex + 2, endIndex);
            parts.push(
              <strong key={key++} className="font-semibold text-gray-900">
                {boldText}
              </strong>
            );
            
            // Continue with remaining text
            currentText = currentText.substring(endIndex + 2);
          }
          
          // Add any remaining text
          if (currentText.trim()) {
            parts.push(currentText);
          }
          
          return parts;
        };
        
        formattedLines.push(
          <div key={index} className="flex items-start gap-4 my-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <ChevronRight className="w-5 h-5 text-berlin-red-600 mt-1 flex-shrink-0" />
            <span className="text-base text-gray-700 leading-relaxed">
              {processBulletText(bulletText)}
            </span>
          </div>
        );
        return;
      }

      // Regular paragraphs
      if (trimmedLine && !trimmedLine.startsWith('Score:')) {
        // Process markdown formatting
        const processText = (text: string): React.ReactNode[] => {
          const parts: React.ReactNode[] = [];
          let currentText = text.replace(/^\d+\.\s*/, '').trim(); // Remove numbered list formatting
          let key = 0;
          
          // Process **bold** text
          while (currentText.includes('**')) {
            const startIndex = currentText.indexOf('**');
            if (startIndex === -1) break;
            
            const endIndex = currentText.indexOf('**', startIndex + 2);
            if (endIndex === -1) break;
            
            // Add text before bold
            if (startIndex > 0) {
              parts.push(currentText.substring(0, startIndex));
            }
            
            // Add bold text
            const boldText = currentText.substring(startIndex + 2, endIndex);
            parts.push(
              <strong key={key++} className="font-semibold text-gray-900">
                {boldText}
              </strong>
            );
            
            // Continue with remaining text
            currentText = currentText.substring(endIndex + 2);
          }
          
          // Add any remaining text
          if (currentText.trim()) {
            parts.push(currentText);
          }
          
          return parts;
        };
        
        if (trimmedLine.trim()) {
          formattedLines.push(
            <p key={index} className="text-gray-700 leading-relaxed mb-6 text-base">
              {processText(trimmedLine)}
            </p>
          );
        }
      }
    });

    return formattedLines;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with File Info and Reset Button */}
      <div className="bg-white border-b border-berlin-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-berlin-gray-900 mb-2">ESG Analysis Report</h1>
            <p className="text-berlin-gray-600">{fileName}</p>
          </div>
          <Button
            onClick={onReset}
            variant="outline"
            className="text-berlin-red-600 border-berlin-red-300 hover:bg-berlin-red-50"
          >
            New Analysis
          </Button>
        </div>
      </div>

      {/* Horizontal Navigation Tabs */}
      <div className="bg-white border-b border-berlin-gray-200 px-8 py-4">
        <div className="flex gap-2 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                activeSection === section.id
                  ? `${section.bgColor} ${section.borderColor} border ${section.color} shadow-sm`
                  : 'text-berlin-gray-600 hover:text-berlin-gray-900 hover:bg-berlin-gray-50'
              }`}
            >
              <div className={activeSection === section.id ? section.color : 'text-berlin-gray-400'}>
                {section.icon}
              </div>
              <span className={`font-medium text-sm ${
                activeSection === section.id ? section.color : 'text-berlin-gray-700'
              }`}>
                {section.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Full Width Content - No Container Box */}
      <div className="px-8 py-8">
        {currentSection && (
          <>
            {/* Section Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-4 rounded-xl ${currentSection.bgColor} ${currentSection.color} shadow-sm`}>
                  {currentSection.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-berlin-gray-900">{currentSection.title}</h2>
                  <div className={`h-1 w-24 rounded mt-2 ${currentSection.bgColor}`}></div>
                </div>
              </div>
            </div>

            {/* Section Content - Full Width, No Box */}
            <div className="space-y-6">
              {formatSectionContent(currentSection.content, currentSection.id)}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-berlin-gray-200 px-8 py-6 mt-12">
        <div className="flex items-center justify-between text-sm text-berlin-gray-500">
          <span>Generated by AI-powered ESG Analysis • {new Date().toLocaleDateString()}</span>
          <span>Powered by OpenAI</span>
        </div>
      </div>
    </div>
  );
};

export default ESGReportDisplay;
