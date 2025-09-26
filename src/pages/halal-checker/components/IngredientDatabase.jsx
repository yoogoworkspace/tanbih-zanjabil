import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const IngredientDatabase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedIngredient, setExpandedIngredient] = useState(null);

  const categories = [
    { id: 'all', name: 'All Categories', icon: 'Grid3x3' },
    { id: 'additives', name: 'Additives', icon: 'Beaker' },
    { id: 'preservatives', name: 'Preservatives', icon: 'Shield' },
    { id: 'emulsifiers', name: 'Emulsifiers', icon: 'Droplets' },
    { id: 'colorings', name: 'Colorings', icon: 'Palette' },
    { id: 'flavorings', name: 'Flavorings', icon: 'Coffee' }
  ];

  const ingredients = [
    {
      id: 1,
      name: 'Gelatin',
      category: 'additives',
      status: 'doubtful',
      eNumber: 'E441',
      description: 'Protein derived from collagen, commonly from pork or beef bones and skin',
      halalConcerns: 'Source animal must be halal and slaughtered according to Islamic law',
      alternatives: ['Agar-agar', 'Carrageenan', 'Pectin'],
      commonProducts: ['Gummy candies', 'Marshmallows', 'Capsules', 'Desserts']
    },
    {
      id: 2,
      name: 'Lecithin',
      category: 'emulsifiers',
      status: 'halal',
      eNumber: 'E322',
      description: 'Natural emulsifier commonly derived from soybeans or sunflower',
      halalConcerns: 'Generally halal when plant-derived, check source if animal-derived',
      alternatives: ['Mono- and diglycerides (plant-based)'],
      commonProducts: ['Chocolate', 'Baked goods', 'Margarine']
    },
    {
      id: 3,
      name: 'Carmine',
      category: 'colorings',
      status: 'haram',
      eNumber: 'E120',
      description: 'Red coloring derived from crushed cochineal insects',
      halalConcerns: 'Derived from insects, considered haram by most Islamic scholars',
      alternatives: ['Beetroot extract', 'Paprika extract', 'Synthetic red dyes'],
      commonProducts: ['Lipstick', 'Food coloring', 'Beverages', 'Candies']
    },
    {
      id: 4,
      name: 'Mono- and Diglycerides',
      category: 'emulsifiers',
      status: 'doubtful',
      eNumber: 'E471',
      description: 'Emulsifiers that can be derived from plant or animal fats',
      halalConcerns: 'Halal if plant-derived, haram if from non-halal animal sources',
      alternatives: ['Plant-based lecithin', 'Polyglycerol esters'],
      commonProducts: ['Bread', 'Ice cream', 'Margarine', 'Baked goods']
    },
    {
      id: 5,
      name: 'Sodium Benzoate',
      category: 'preservatives',
      status: 'halal',
      eNumber: 'E211',
      description: 'Synthetic preservative used to prevent bacterial growth',
      halalConcerns: 'Generally considered halal as it is synthetically produced',
      alternatives: ['Potassium sorbate', 'Natural preservatives'],
      commonProducts: ['Soft drinks', 'Pickles', 'Sauces', 'Jams']
    },
    {
      id: 6,
      name: 'Vanilla Extract',
      category: 'flavorings',
      status: 'doubtful',
      eNumber: null,
      description: 'Flavoring extracted from vanilla beans, often contains alcohol',
      halalConcerns: 'May contain alcohol used in extraction process',
      alternatives: ['Vanilla powder', 'Alcohol-free vanilla extract', 'Natural vanilla flavor'],
      commonProducts: ['Baked goods', 'Ice cream', 'Beverages', 'Desserts']
    }
  ];

  const filteredIngredients = ingredients?.filter(ingredient => {
    const matchesSearch = ingredient?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         ingredient?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ingredient?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'halal':
        return 'text-success bg-success/10 border-success/20';
      case 'haram':
        return 'text-error bg-error/10 border-error/20';
      case 'doubtful':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'halal':
        return 'CheckCircle';
      case 'haram':
        return 'XCircle';
      case 'doubtful':
        return 'AlertTriangle';
      default:
        return 'HelpCircle';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="font-heading text-lg font-bold text-foreground mb-2">
          Ingredient Database
        </h3>
        <p className="font-caption text-sm text-muted-foreground">
          Comprehensive database of common food ingredients and their halal status
        </p>
      </div>
      {/* Search and Categories */}
      <div className="p-6 border-b border-border space-y-4">
        <Input
          type="search"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
        />

        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => (
            <Button
              key={category?.id}
              variant={selectedCategory === category?.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category?.id)}
              iconName={category?.icon}
              iconPosition="left"
            >
              {category?.name}
            </Button>
          ))}
        </div>
      </div>
      {/* Ingredients List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredIngredients?.map((ingredient) => (
          <div
            key={ingredient?.id}
            className="p-4 border-b border-border last:border-b-0"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-foreground">{ingredient?.name}</h4>
                  {ingredient?.eNumber && (
                    <span className="font-data text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      {ingredient?.eNumber}
                    </span>
                  )}
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs border ${getStatusColor(ingredient?.status)}`}>
                    <Icon name={getStatusIcon(ingredient?.status)} size={12} />
                    <span className="capitalize">{ingredient?.status}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-2">
                  {ingredient?.description}
                </p>

                {expandedIngredient === ingredient?.id && (
                  <div className="space-y-3 mt-4">
                    {/* Halal Concerns */}
                    <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                      <h5 className="font-medium text-foreground mb-1 flex items-center">
                        <Icon name="AlertTriangle" size={14} className="mr-2 text-warning" />
                        Halal Concerns
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {ingredient?.halalConcerns}
                      </p>
                    </div>

                    {/* Alternatives */}
                    <div>
                      <h5 className="font-medium text-foreground mb-2 flex items-center">
                        <Icon name="ArrowRight" size={14} className="mr-2" />
                        Halal Alternatives
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {ingredient?.alternatives?.map((alternative, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-success/10 text-success text-xs rounded border border-success/20"
                          >
                            {alternative}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Common Products */}
                    <div>
                      <h5 className="font-medium text-foreground mb-2 flex items-center">
                        <Icon name="Package" size={14} className="mr-2" />
                        Common Products
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {ingredient?.commonProducts?.map((product, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedIngredient(
                  expandedIngredient === ingredient?.id ? null : ingredient?.id
                )}
                iconName={expandedIngredient === ingredient?.id ? 'ChevronUp' : 'ChevronDown'}
              />
            </div>
          </div>
        ))}
      </div>
      {filteredIngredients?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Search" size={24} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            {searchTerm ? `No ingredients found matching "${searchTerm}"` : 'No ingredients in this category'}
          </p>
        </div>
      )}
      {/* Database Stats */}
      <div className="p-4 bg-muted/30 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Showing {filteredIngredients?.length} of {ingredients?.length} ingredients
          </span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-success">
              <Icon name="CheckCircle" size={12} />
              <span>{ingredients?.filter(i => i?.status === 'halal')?.length} Halal</span>
            </span>
            <span className="flex items-center space-x-1 text-warning">
              <Icon name="AlertTriangle" size={12} />
              <span>{ingredients?.filter(i => i?.status === 'doubtful')?.length} Doubtful</span>
            </span>
            <span className="flex items-center space-x-1 text-error">
              <Icon name="XCircle" size={12} />
              <span>{ingredients?.filter(i => i?.status === 'haram')?.length} Haram</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientDatabase;