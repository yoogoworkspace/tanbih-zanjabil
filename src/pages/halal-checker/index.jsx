import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import VerificationMethods from './components/VerificationMethods';
import VerificationResult from './components/VerificationResult';
import VerificationHistory from './components/VerificationHistory';
import IngredientDatabase from './components/IngredientDatabase';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const HalalChecker = () => {
  const [currentResult, setCurrentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('checker');
  const [verificationHistory, setVerificationHistory] = useState([
    {
      productName: 'Nestle KitKat',
      status: 'doubtful',
      confidence: 75,
      ingredients: ['Sugar', 'Cocoa Butter', 'Milk Powder', 'Wheat Flour', 'Lecithin'],
      problematicIngredients: ['Lecithin (source unclear)'],
      references: [
        {
          type: 'hadith',
          text: 'What is halal is clear and what is haram is clear',
          reference: 'Sahih Bukhari'
        }
      ],
      timestamp: new Date(Date.now() - 86400000)?.toISOString(),
      note: 'Check with manufacturer for lecithin source'
    },
    {
      productName: 'Coca Cola',
      status: 'halal',
      confidence: 90,
      ingredients: ['Carbonated Water', 'Sugar', 'Caramel Color', 'Phosphoric Acid', 'Natural Flavors'],
      problematicIngredients: [],
      references: [
        {
          type: 'quran',
          text: 'And eat of what Allah has provided for you [which is] lawful and good',
          reference: 'Quran 5:88'
        }
      ],
      timestamp: new Date(Date.now() - 172800000)?.toISOString()
    },
    {
      productName: 'Haribo Gummy Bears',
      status: 'haram',
      confidence: 95,
      ingredients: ['Sugar', 'Glucose Syrup', 'Gelatin', 'Citric Acid', 'Artificial Colors'],
      problematicIngredients: ['Gelatin (pork-derived)'],
      references: [
        {
          type: 'quran',
          text: 'Forbidden to you is dead meat, blood, the flesh of swine',
          reference: 'Quran 5:3'
        }
      ],
      timestamp: new Date(Date.now() - 259200000)?.toISOString()
    }
  ]);

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteItem, setNoteItem] = useState(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    // Simulate loading saved data
    const savedHistory = localStorage.getItem('halalCheckerHistory');
    if (savedHistory) {
      try {
        setVerificationHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  const handleVerificationResult = (result) => {
    setIsLoading(true);
    
    // Simulate API processing time
    setTimeout(() => {
      setCurrentResult(result);
      setIsLoading(false);
      
      // Add to history
      const updatedHistory = [result, ...verificationHistory];
      setVerificationHistory(updatedHistory);
      localStorage.setItem('halalCheckerHistory', JSON.stringify(updatedHistory));
    }, 2000);
  };

  const handleQuickCheck = (productName) => {
    setActiveTab('checker');
    
    // Simulate quick check
    const mockResult = {
      productName: productName,
      status: Math.random() > 0.5 ? 'halal' : 'doubtful',
      confidence: Math.floor(Math.random() * 30) + 70,
      ingredients: ['Various ingredients'],
      problematicIngredients: Math.random() > 0.7 ? ['Unknown additives'] : [],
      references: [
        {
          type: 'quran',
          text: 'O you who believe! Eat of the good things We have provided for you',
          reference: 'Quran 2:172'
        }
      ],
      timestamp: new Date()?.toISOString()
    };
    
    handleVerificationResult(mockResult);
  };

  const handleSaveToHistory = (result) => {
    if (!verificationHistory?.find(item => item?.productName === result?.productName && item?.timestamp === result?.timestamp)) {
      const updatedHistory = [result, ...verificationHistory];
      setVerificationHistory(updatedHistory);
      localStorage.setItem('halalCheckerHistory', JSON.stringify(updatedHistory));
    }
  };

  const handleDeleteFromHistory = (itemToDelete) => {
    const updatedHistory = verificationHistory?.filter(item => 
      !(item?.productName === itemToDelete?.productName && item?.timestamp === itemToDelete?.timestamp)
    );
    setVerificationHistory(updatedHistory);
    localStorage.setItem('halalCheckerHistory', JSON.stringify(updatedHistory));
  };

  const handleAddNote = (item) => {
    setNoteItem(item);
    setNoteText(item?.note || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (noteItem) {
      const updatedHistory = verificationHistory?.map(item => 
        item?.productName === noteItem?.productName && item?.timestamp === noteItem?.timestamp
          ? { ...item, note: noteText }
          : item
      );
      setVerificationHistory(updatedHistory);
      localStorage.setItem('halalCheckerHistory', JSON.stringify(updatedHistory));
      
      if (currentResult && currentResult?.productName === noteItem?.productName && currentResult?.timestamp === noteItem?.timestamp) {
        setCurrentResult({ ...currentResult, note: noteText });
      }
    }
    setShowNoteModal(false);
    setNoteItem(null);
    setNoteText('');
  };

  const handleRecheck = (item) => {
    setActiveTab('checker');
    handleVerificationResult({
      ...item,
      timestamp: new Date()?.toISOString()
    });
  };

  const tabs = [
    { id: 'checker', label: 'Halal Checker', icon: 'Shield' },
    { id: 'history', label: 'History', icon: 'History' },
    { id: 'database', label: 'Ingredients', icon: 'Database' },
    { id: 'quick', label: 'Quick Actions', icon: 'Zap' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">
                  Halal Checker
                </h1>
                <p className="font-caption text-muted-foreground">
                  AI-powered halal verification with Islamic references
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="font-data text-sm text-muted-foreground">Verified</span>
                </div>
                <p className="font-heading text-2xl font-bold text-foreground mt-1">
                  {verificationHistory?.length}
                </p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={16} className="text-primary" />
                  <span className="font-data text-sm text-muted-foreground">Ingredients</span>
                </div>
                <p className="font-heading text-2xl font-bold text-foreground mt-1">1,200+</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Book" size={16} className="text-accent" />
                  <span className="font-data text-sm text-muted-foreground">References</span>
                </div>
                <p className="font-heading text-2xl font-bold text-foreground mt-1">500+</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Target" size={16} className="text-warning" />
                  <span className="font-data text-sm text-muted-foreground">Accuracy</span>
                </div>
                <p className="font-heading text-2xl font-bold text-foreground mt-1">95%</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {activeTab === 'checker' && (
              <>
                <div className="lg:col-span-2 space-y-6">
                  <VerificationMethods
                    onVerificationResult={handleVerificationResult}
                    isLoading={isLoading}
                  />
                  
                  {(currentResult || isLoading) && (
                    <div>
                      {isLoading ? (
                        <div className="bg-card rounded-lg shadow-islamic-subtle border border-border p-8">
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                              <div className="animate-spin">
                                <Icon name="Loader2" size={24} className="text-primary" />
                              </div>
                            </div>
                            <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                              Analyzing Product
                            </h3>
                            <p className="font-caption text-sm text-muted-foreground">
                              AI is checking halal status with Islamic references...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <VerificationResult
                          result={currentResult}
                          onSaveToHistory={handleSaveToHistory}
                          onAddNote={handleAddNote}
                        />
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <QuickActions
                    onQuickCheck={handleQuickCheck}
                    recentChecks={verificationHistory?.slice(0, 3)}
                  />
                </div>
              </>
            )}

            {activeTab === 'history' && (
              <div className="lg:col-span-3">
                <VerificationHistory
                  history={verificationHistory}
                  onRecheck={handleRecheck}
                  onDeleteItem={handleDeleteFromHistory}
                  onAddNote={handleAddNote}
                />
              </div>
            )}

            {activeTab === 'database' && (
              <div className="lg:col-span-3">
                <IngredientDatabase />
              </div>
            )}

            {activeTab === 'quick' && (
              <div className="lg:col-span-3">
                <QuickActions
                  onQuickCheck={handleQuickCheck}
                  recentChecks={verificationHistory?.slice(0, 5)}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-islamic-prominent border border-border w-full max-w-md">
            <div className="p-6 border-b border-border">
              <h3 className="font-heading text-lg font-bold text-foreground">
                Add Note
              </h3>
              <p className="font-caption text-sm text-muted-foreground mt-1">
                Add a personal note for {noteItem?.productName}
              </p>
            </div>
            
            <div className="p-6">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e?.target?.value)}
                placeholder="Enter your note here..."
                className="w-full h-32 p-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            
            <div className="p-6 border-t border-border flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteItem(null);
                  setNoteText('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSaveNote}
              >
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HalalChecker;