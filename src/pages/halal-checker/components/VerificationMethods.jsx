import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const VerificationMethods = ({ onVerificationResult, isLoading }) => {
  const [activeMethod, setActiveMethod] = useState('text');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions] = useState([
    'Nestle KitKat',
    'Coca Cola',
    'Haldiram Namkeen',
    'Maggi Noodles',
    'Amul Butter',
    'Britannia Biscuits'
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef(null);
  const [scannerActive, setScannerActive] = useState(false);

  const handleTextSearch = () => {
    if (!searchQuery?.trim()) return;
    
    const mockResult = {
      productName: searchQuery,
      status: searchQuery?.toLowerCase()?.includes('halal') || searchQuery?.toLowerCase()?.includes('amul') ? 'halal' : 'doubtful',
      confidence: Math.floor(Math.random() * 30) + 70,
      ingredients: ['Water', 'Sugar', 'Natural Flavors', 'Citric Acid', 'Preservatives'],
      problematicIngredients: searchQuery?.toLowerCase()?.includes('gelatin') ? ['Gelatin (source unclear)'] : [],
      references: [
        {
          type: 'quran',
          text: 'O you who believe! Eat of the good things We have provided for you',
          reference: 'Quran 2:172'
        },
        {
          type: 'hadith',
          text: 'What is halal is clear and what is haram is clear',
          reference: 'Sahih Bukhari'
        }
      ],
      timestamp: new Date()?.toISOString()
    };
    
    onVerificationResult(mockResult);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleBarcodeUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    // Mock barcode processing
    setTimeout(() => {
      const mockResult = {
        productName: 'Scanned Product - ' + file?.name?.split('.')?.[0],
        barcode: '1234567890123',
        status: 'halal',
        confidence: 85,
        ingredients: ['Wheat Flour', 'Sugar', 'Palm Oil', 'Salt', 'Yeast'],
        problematicIngredients: [],
        references: [
          {
            type: 'quran',
            text: 'And eat of what Allah has provided for you [which is] lawful and good',
            reference: 'Quran 5:88'
          }
        ],
        timestamp: new Date()?.toISOString()
      };
      
      onVerificationResult(mockResult);
    }, 2000);
  };

  const handleImageUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;

    // Mock image text recognition
    setTimeout(() => {
      const mockResult = {
        productName: 'Image Analysis - Ingredient List',
        status: 'haram',
        confidence: 92,
        ingredients: ['Wheat', 'Sugar', 'Gelatin', 'Artificial Colors', 'Preservatives'],
        problematicIngredients: ['Gelatin (likely pork-derived)', 'Artificial Colors (may contain carmine)'],
        references: [
          {
            type: 'quran',
            text: 'Forbidden to you is dead meat, blood, the flesh of swine',
            reference: 'Quran 5:3'
          },
          {
            type: 'hadith',
            text: 'Allah has forbidden the eating of dead animals, blood and pork',
            reference: 'Sahih Muslim'
          }
        ],
        timestamp: new Date()?.toISOString()
      };
      
      onVerificationResult(mockResult);
    }, 3000);
  };

  const filteredSuggestions = suggestions?.filter(item =>
    item?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="font-heading text-xl font-bold text-foreground mb-2">
          Verification Methods
        </h2>
        <p className="font-caption text-sm text-muted-foreground">
          Choose your preferred method to check halal status
        </p>
      </div>
      {/* Method Selection */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeMethod === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMethod('text')}
            iconName="Search"
            iconPosition="left"
          >
            Product Search
          </Button>
          <Button
            variant={activeMethod === 'barcode' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMethod('barcode')}
            iconName="QrCode"
            iconPosition="left"
          >
            Barcode Scanner
          </Button>
          <Button
            variant={activeMethod === 'image' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveMethod('image')}
            iconName="Camera"
            iconPosition="left"
          >
            Image Analysis
          </Button>
        </div>
      </div>
      <div className="p-6">
        {/* Text Search Method */}
        {activeMethod === 'text' && (
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter product name (e.g., Nestle KitKat, Halal Chicken)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e?.target?.value);
                  setShowSuggestions(e?.target?.value?.length > 0);
                }}
                onFocus={() => setShowSuggestions(searchQuery?.length > 0)}
                className="pr-12"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTextSearch}
                disabled={!searchQuery?.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Icon name="Search" size={16} />
              </Button>

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions?.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-islamic-moderate z-10 max-h-48 overflow-y-auto">
                  {filteredSuggestions?.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Info" size={16} />
              <span>Search by product name, brand, or ingredients</span>
            </div>
          </div>
        )}

        {/* Barcode Scanner Method */}
        {activeMethod === 'barcode' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                <Icon name="QrCode" size={48} className="text-muted-foreground" />
              </div>
              
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleBarcodeUpload}
                ref={fileInputRef}
                className="hidden"
              />
              
              <Button
                variant="default"
                onClick={() => fileInputRef?.current?.click()}
                disabled={isLoading}
                iconName="Camera"
                iconPosition="left"
                className="mb-2"
              >
                Scan Barcode
              </Button>
              
              <p className="font-caption text-sm text-muted-foreground">
                Point your camera at the product barcode
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Lightbulb" size={16} className="text-warning mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Scanning Tips:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Ensure good lighting</li>
                    <li>• Hold camera steady</li>
                    <li>• Keep barcode in frame</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Analysis Method */}
        {activeMethod === 'image' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                <Icon name="Image" size={48} className="text-muted-foreground" />
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              
              <Button
                variant="default"
                onClick={() => document.getElementById('image-upload')?.click()}
                disabled={isLoading}
                iconName="Upload"
                iconPosition="left"
                className="mb-2"
              >
                Upload Ingredient Image
              </Button>
              
              <p className="font-caption text-sm text-muted-foreground">
                Upload a clear image of the ingredient list
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Eye" size={16} className="text-accent mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Image Requirements:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Clear, readable text</li>
                    <li>• Good contrast and lighting</li>
                    <li>• Focus on ingredient list</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationMethods;