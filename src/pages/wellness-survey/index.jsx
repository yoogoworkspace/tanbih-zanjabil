import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SurveyQuestion from './components/SurveyQuestion';
import SurveyResults from './components/SurveyResults';
import RecommendationCard from './components/RecommendationCard';
import SurveyProgress from './components/SurveyProgress';
import Button from '../../components/ui/Button';


const WellnessSurvey = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock user data
  const userData = {
    completedSurveys: 3,
    lastSurveyDate: '2024-09-15',
    previousScores: {
      spiritual: 75,
      mental: 68,
      prayer: 82,
      knowledge: 70,
      community: 65
    }
  };

  // Survey questions data
  const surveyQuestions = [
    {
      id: 'spiritual_connection',
      question: 'How connected do you feel to Allah (SWT) in your daily life?',
      subtitle: 'Consider your overall sense of spiritual presence and awareness',
      type: 'likert',
      required: true,
      description: 'Rate your spiritual connection on a scale from very disconnected to very connected',
      options: [
        { value: 1, label: 'Very Disconnected', description: 'Rarely feel spiritual presence' },
        { value: 2, label: 'Somewhat Disconnected', description: 'Occasional spiritual awareness' },
        { value: 3, label: 'Neutral', description: 'Moderate spiritual connection' },
        { value: 4, label: 'Connected', description: 'Regular spiritual awareness' },
        { value: 5, label: 'Very Connected', description: 'Strong daily spiritual presence' }
      ]
    },
    {
      id: 'prayer_consistency',
      question: 'How consistent are you with your five daily prayers (Salah)?',
      subtitle: 'Reflect on your prayer routine over the past month',
      type: 'multiple-choice',
      required: true,
      options: [
        { value: 'always', label: 'Always on time', description: 'I pray all five prayers at their prescribed times' },
        { value: 'mostly', label: 'Mostly consistent', description: 'I pray regularly but sometimes miss timing' },
        { value: 'sometimes', label: 'Sometimes', description: 'I pray some prayers but not consistently' },
        { value: 'rarely', label: 'Rarely', description: 'I struggle to maintain regular prayer schedule' },
        { value: 'never', label: 'Never', description: 'I do not currently pray regularly' }
      ]
    },
    {
      id: 'stress_levels',
      question: 'How would you rate your current stress and anxiety levels?',
      subtitle: 'Consider your mental state over the past two weeks',
      type: 'likert',
      required: true,
      description: 'Rate your stress levels from very low to very high',
      options: [
        { value: 1, label: 'Very Low', description: 'Feeling calm and peaceful' },
        { value: 2, label: 'Low', description: 'Generally relaxed with minor stress' },
        { value: 3, label: 'Moderate', description: 'Some stress but manageable' },
        { value: 4, label: 'High', description: 'Frequently stressed or anxious' },
        { value: 5, label: 'Very High', description: 'Overwhelming stress and anxiety' }
      ]
    },
    {
      id: 'islamic_knowledge',
      question: 'How confident do you feel about your Islamic knowledge?',
      subtitle: 'Consider your understanding of Quran, Hadith, and Islamic practices',
      type: 'multiple-choice',
      required: true,
      options: [
        { value: 'expert', label: 'Very Knowledgeable', description: 'Strong understanding of Islamic teachings' },
        { value: 'intermediate', label: 'Moderately Knowledgeable', description: 'Good basic knowledge with room to grow' },
        { value: 'beginner', label: 'Basic Knowledge', description: 'Limited but growing understanding' },
        { value: 'minimal', label: 'Minimal Knowledge', description: 'Very basic understanding of Islam' }
      ]
    },
    {
      id: 'community_connection',
      question: 'How connected do you feel to your Muslim community?',
      subtitle: 'Think about your relationships with fellow Muslims and mosque involvement',
      type: 'likert',
      required: true,
      description: 'Rate your community connection from very isolated to very connected',
      options: [
        { value: 1, label: 'Very Isolated', description: 'No community connections' },
        { value: 2, label: 'Somewhat Isolated', description: 'Limited community interaction' },
        { value: 3, label: 'Neutral', description: 'Some community involvement' },
        { value: 4, label: 'Connected', description: 'Regular community participation' },
        { value: 5, label: 'Very Connected', description: 'Active community member' }
      ]
    },
    {
      id: 'dhikr_practice',
      question: 'Which forms of dhikr (remembrance of Allah) do you currently practice?',
      subtitle: 'Select all that apply to your regular spiritual practices',
      type: 'checkbox-multiple',
      required: false,
      options: [
        { value: 'morning_adhkar', label: 'Morning Adhkar', description: 'Reciting morning supplications' },
        { value: 'evening_adhkar', label: 'Evening Adhkar', description: 'Reciting evening supplications' },
        { value: 'tasbih', label: 'Tasbih (SubhanAllah)', description: 'Glorifying Allah with tasbih' },
        { value: 'istighfar', label: 'Istighfar', description: 'Seeking forgiveness from Allah' },
        { value: 'salawat', label: 'Salawat on Prophet', description: 'Sending blessings on Prophet Muhammad (PBUH)' },
        { value: 'quran_recitation', label: 'Quran Recitation', description: 'Regular reading of the Holy Quran' },
        { value: 'none', label: 'None currently', description: 'I do not practice dhikr regularly' }
      ]
    },
    {
      id: 'mental_challenges',
      question: 'What mental or emotional challenges are you currently facing?',
      subtitle: 'Select all that apply - this helps us provide targeted Islamic guidance',
      type: 'checkbox-multiple',
      required: false,
      options: [
        { value: 'anxiety', label: 'Anxiety', description: 'Feeling worried or anxious frequently' },
        { value: 'depression', label: 'Low mood/Depression', description: 'Feeling sad or hopeless' },
        { value: 'anger', label: 'Anger management', description: 'Difficulty controlling anger' },
        { value: 'loneliness', label: 'Loneliness', description: 'Feeling isolated or alone' },
        { value: 'purpose', label: 'Lack of purpose', description: 'Feeling directionless in life' },
        { value: 'relationships', label: 'Relationship issues', description: 'Problems with family or friends' },
        { value: 'work_stress', label: 'Work/Study stress', description: 'Pressure from work or studies' },
        { value: 'none', label: 'None currently', description: 'I am not facing significant challenges' }
      ]
    },
    {
      id: 'spiritual_goals',
      question: 'What are your main spiritual goals for the next 3 months?',
      subtitle: 'Share your aspirations for spiritual growth and development',
      type: 'textarea',
      required: false,
      placeholder: 'Describe your spiritual goals, such as improving prayer consistency, learning more about Islam, strengthening your relationship with Allah, etc.'
    },
    {
      id: 'additional_support',
      question: 'Is there anything specific you would like Islamic guidance or support with?',
      subtitle: 'This helps us provide more personalized recommendations',
      type: 'textarea',
      required: false,
      placeholder: 'Share any specific areas where you seek Islamic guidance, such as dealing with specific challenges, understanding certain concepts, or improving particular aspects of your faith...'
    }
  ];

  // Mock AI analysis function
  const analyzeResponses = async (responses) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Calculate scores based on responses
    const spiritualScore = responses?.spiritual_connection ? (responses?.spiritual_connection * 20) : 60;
    const prayerScore = responses?.prayer_consistency ? 
      (responses?.prayer_consistency === 'always' ? 100 : 
       responses?.prayer_consistency === 'mostly' ? 80 : 
       responses?.prayer_consistency === 'sometimes' ? 60 : 
       responses?.prayer_consistency === 'rarely' ? 40 : 20) : 60;
    const mentalScore = responses?.stress_levels ? (100 - (responses?.stress_levels - 1) * 20) : 60;
    const knowledgeScore = responses?.islamic_knowledge ? 
      (responses?.islamic_knowledge === 'expert' ? 90 : 
       responses?.islamic_knowledge === 'intermediate' ? 70 : 
       responses?.islamic_knowledge === 'beginner' ? 50 : 30) : 60;
    const communityScore = responses?.community_connection ? (responses?.community_connection * 20) : 60;

    const mockResults = {
      spiritualScore,
      prayerScore,
      mentalScore,
      knowledgeScore,
      communityScore,
      strengths: [
        { title: 'Strong Prayer Foundation', description: 'Your commitment to Salah shows dedication to your faith' },
        { title: 'Spiritual Awareness', description: 'You demonstrate good awareness of your spiritual state' }
      ],
      growthAreas: [
        { title: 'Community Engagement', description: 'Consider increasing involvement with your local Muslim community' },
        { title: 'Stress Management', description: 'Islamic practices can help manage daily stress and anxiety' }
      ],
      dhikrRecommendations: [
        {
          id: 1,
          type: 'dhikr',
          title: 'Morning Adhkar for Peace',
          description: 'Start your day with protective supplications to reduce anxiety and increase spiritual connection',
          arabicText: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
          transliteration: 'A\'udhu billahi min ash-shaytani\'r-rajim',
          translation: 'I seek refuge in Allah from Satan, the accursed',
          benefits: ['Reduces morning anxiety', 'Provides spiritual protection', 'Increases mindfulness'],
          duration: '5-10 minutes',
          frequency: 'Daily after Fajr',
          difficulty: 'Beginner',
          priority: 'high',
          instructions: `Begin after your Fajr prayer.\nRecite this dhikr 3 times while reflecting on Allah's protection.\nFollow with other morning adhkar from authentic sources.`,
          references: [
            { source: 'Quran 16:98', text: 'So when you recite the Quran, seek refuge in Allah from Satan, the accursed.' }
          ]
        }
      ],
      duaRecommendations: [
        {
          id: 2,
          type: 'dua',title: 'Dua for Anxiety Relief',description: 'A powerful supplication to seek Allah\'s help in times of worry and distress',
          arabicText: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
          transliteration: 'Allahumma inni a\'udhu bika min al-hammi wal-hazan',
          translation: 'O Allah, I seek refuge in You from worry and grief',
          benefits: ['Calms the heart', 'Reduces anxiety', 'Strengthens trust in Allah'],
          duration: '2-3 minutes',
          frequency: 'As needed',
          difficulty: 'Beginner',
          instructions: `Recite when feeling anxious or worried.\nReflect on the meaning while saying the dua.\nRepeat 7 times for maximum benefit.`,
          references: [
            { source: 'Sahih Bukhari', text: 'The Prophet (PBUH) used to seek refuge from worry and grief' }
          ]
        }
      ],
      surahRecommendations: [
        {
          id: 3,
          type: 'surah',
          title: 'Surah Al-Fatiha Reflection',
          description: 'Deep contemplation of the opening chapter for spiritual guidance and healing',
          benefits: ['Provides spiritual healing', 'Increases connection with Allah', 'Brings peace to the heart'],
          duration: '10-15 minutes',
          frequency: 'Daily',
          difficulty: 'Beginner',
          instructions: `Read Surah Al-Fatiha slowly with translation.\nReflect on each verse's meaning.\nContemplate how it applies to your current situation.`,
          references: [
            { source: 'Hadith', text: 'Al-Fatiha is a cure for every disease' }
          ]
        }
      ],
      recommendations: []
    };

    // Combine all recommendations
    mockResults.recommendations = [
      ...mockResults?.dhikrRecommendations,
      ...mockResults?.duaRecommendations,
      ...mockResults?.surahRecommendations
    ];

    setIsAnalyzing(false);
    return mockResults;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = async () => {
    if (currentStep < surveyQuestions?.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete survey
      setSurveyCompleted(true);
      const analysisResults = await analyzeResponses(answers);
      setResults(analysisResults);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRetakeSurvey = () => {
    setCurrentStep(0);
    setAnswers({});
    setSurveyCompleted(false);
    setShowResults(false);
    setShowRecommendations(false);
    setResults(null);
  };

  const handleViewRecommendations = () => {
    setShowRecommendations(true);
  };

  const handleImplementRecommendation = (recommendation) => {
    console.log('Implementing recommendation:', recommendation);
    // Here you would integrate with the AI chat companion or other systems
  };

  const handleSaveToSchedule = (recommendation) => {
    console.log('Saving to schedule:', recommendation);
    // Here you would integrate with the prayer scheduler system
  };

  const currentQuestion = surveyQuestions?.[currentStep];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Islamic Wellness Assessment
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive evaluation of your spiritual, mental, and emotional well-being through an Islamic lens. 
              Receive personalized guidance based on Quran and Sunnah.
            </p>
          </div>

          {!surveyCompleted && !showResults && (
            <>
              <SurveyProgress 
                currentStep={currentStep + 1}
                totalSteps={surveyQuestions?.length}
                completedSurveys={userData?.completedSurveys}
                lastSurveyDate={userData?.lastSurveyDate}
              />

              <SurveyQuestion
                question={currentQuestion}
                answer={answers?.[currentQuestion?.id]}
                onAnswerChange={(answer) => handleAnswerChange(currentQuestion?.id, answer)}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isFirst={currentStep === 0}
                isLast={currentStep === surveyQuestions?.length - 1}
                currentIndex={currentStep}
                totalQuestions={surveyQuestions?.length}
              />
            </>
          )}

          {isAnalyzing && (
            <div className="text-center py-16">
              <div className="bg-card rounded-xl shadow-islamic-moderate p-8 max-w-md mx-auto">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Analyzing Your Responses
                </h3>
                <p className="text-muted-foreground mb-4">
                  Our AI is processing your answers to provide personalized Islamic guidance...
                </p>
                <div className="text-sm text-muted-foreground">
                  This may take a few moments
                </div>
              </div>
            </div>
          )}

          {showResults && !showRecommendations && results && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                  Your Wellness Assessment Results
                </h2>
                <p className="text-muted-foreground">
                  Based on your responses, here's your comprehensive wellness analysis
                </p>
              </div>

              <SurveyResults
                results={results}
                onRetakeSurvey={handleRetakeSurvey}
                onViewRecommendations={handleViewRecommendations}
              />
            </>
          )}

          {showRecommendations && results && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Personalized Islamic Recommendations
                  </h2>
                  <p className="text-muted-foreground">
                    Tailored spiritual practices based on your assessment results
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowRecommendations(false)}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Back to Results
                </Button>
              </div>

              <div className="space-y-6">
                {results?.recommendations?.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation?.id}
                    recommendation={recommendation}
                    onImplement={handleImplementRecommendation}
                    onSaveToSchedule={handleSaveToSchedule}
                  />
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button
                  variant="default"
                  onClick={handleRetakeSurvey}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Take New Assessment
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default WellnessSurvey;