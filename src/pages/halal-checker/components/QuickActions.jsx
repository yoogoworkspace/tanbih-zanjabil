import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ onQuickCheck, recentChecks }) => {
  const commonProducts = [
    { name: 'McDonald\'s Fries', category: 'Fast Food', icon: 'Utensils' },
    { name: 'Coca Cola', category: 'Beverages', icon: 'Coffee' },
    { name: 'KitKat Chocolate', category: 'Confectionery', icon: 'Cookie' },
    { name: 'Lay\'s Chips', category: 'Snacks', icon: 'Package' },
    { name: 'Oreo Cookies', category: 'Biscuits', icon: 'Cookie' },
    { name: 'Nutella Spread', category: 'Spreads', icon: 'Jar' }
  ];

  const quickCategories = [
    { name: 'Fast Food', icon: 'Utensils', color: 'bg-red-500' },
    { name: 'Beverages', icon: 'Coffee', color: 'bg-blue-500' },
    { name: 'Snacks', icon: 'Package', color: 'bg-yellow-500' },
    { name: 'Dairy', icon: 'Milk', color: 'bg-green-500' },
    { name: 'Meat', icon: 'Beef', color: 'bg-red-600' },
    { name: 'Confectionery', icon: 'Cookie', color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Check Products */}
      <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading text-lg font-bold text-foreground mb-1">
            Quick Check
          </h3>
          <p className="font-caption text-sm text-muted-foreground">
            Popular products for instant verification
          </p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {commonProducts?.map((product, index) => (
              <button
                key={index}
                onClick={() => onQuickCheck(product?.name)}
                className="flex items-center space-x-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={product?.icon} size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{product?.name}</p>
                  <p className="text-xs text-muted-foreground">{product?.category}</p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Category Quick Access */}
      <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading text-lg font-bold text-foreground mb-1">
            Browse by Category
          </h3>
          <p className="font-caption text-sm text-muted-foreground">
            Explore products by food categories
          </p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickCategories?.map((category, index) => (
              <button
                key={index}
                onClick={() => onQuickCheck(`${category?.name} products`)}
                className="flex flex-col items-center space-y-2 p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className={`w-12 h-12 ${category?.color} rounded-lg flex items-center justify-center`}>
                  <Icon name={category?.icon} size={24} className="text-white" />
                </div>
                <span className="font-medium text-foreground text-sm">{category?.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Recent Checks */}
      {recentChecks?.length > 0 && (
        <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
          <div className="p-4 border-b border-border">
            <h3 className="font-heading text-lg font-bold text-foreground mb-1">
              Recent Checks
            </h3>
            <p className="font-caption text-sm text-muted-foreground">
              Quickly recheck recently verified products
            </p>
          </div>
          
          <div className="p-4">
            <div className="space-y-2">
              {recentChecks?.slice(0, 3)?.map((check, index) => (
                <button
                  key={index}
                  onClick={() => onQuickCheck(check?.productName)}
                  className="flex items-center justify-between w-full p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      check?.status === 'halal' ? 'bg-success' :
                      check?.status === 'haram' ? 'bg-error' : 'bg-warning'
                    }`}></div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{check?.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(check.timestamp)?.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Tips & Guidelines */}
      <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading text-lg font-bold text-foreground mb-1">
            Halal Guidelines
          </h3>
          <p className="font-caption text-sm text-muted-foreground">
            Important tips for halal verification
          </p>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Look for Certification</p>
              <p className="text-muted-foreground">Always check for recognized halal certification marks</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Check Ingredients</p>
              <p className="text-muted-foreground">Read ingredient lists carefully for doubtful items</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Icon name="Book" size={16} className="text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">When in Doubt</p>
              <p className="text-muted-foreground">Consult Islamic scholars for complex cases</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;