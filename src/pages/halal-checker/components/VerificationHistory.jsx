import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const VerificationHistory = ({ history, onRecheck, onDeleteItem, onAddNote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredHistory = history?.filter(item => {
      const matchesSearch = item?.productName?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesFilter = filterStatus === 'all' || item?.status === filterStatus;
      return matchesSearch && matchesFilter;
    })?.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === 'name') {
        return a?.productName?.localeCompare(b?.productName);
      } else if (sortBy === 'status') {
        return a?.status?.localeCompare(b?.status);
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'halal':
        return 'text-success bg-success/10';
      case 'haram':
        return 'text-error bg-error/10';
      case 'doubtful':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
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

  if (history?.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Verification History
          </h3>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
            <Icon name="History" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-2">No verification history yet</p>
          <p className="text-sm text-muted-foreground">
            Your checked products will appear here for quick reference
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-islamic-subtle border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-foreground">
            Verification History
          </h3>
          <div className="text-sm text-muted-foreground">
            {filteredHistory?.length} of {history?.length} items
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'halal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('halal')}
              iconName="CheckCircle"
              iconPosition="left"
            >
              Halal
            </Button>
            <Button
              variant={filterStatus === 'haram' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('haram')}
              iconName="XCircle"
              iconPosition="left"
            >
              Haram
            </Button>
            <Button
              variant={filterStatus === 'doubtful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('doubtful')}
              iconName="AlertTriangle"
              iconPosition="left"
            >
              Doubtful
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button
              variant={sortBy === 'recent' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('recent')}
            >
              Recent
            </Button>
            <Button
              variant={sortBy === 'name' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('name')}
            >
              Name
            </Button>
            <Button
              variant={sortBy === 'status' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('status')}
            >
              Status
            </Button>
          </div>
        </div>
      </div>
      {/* History Items */}
      <div className="max-h-96 overflow-y-auto">
        {filteredHistory?.map((item, index) => (
          <div
            key={index}
            className="p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-foreground">{item?.productName}</h4>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs ${getStatusColor(item?.status)}`}>
                    <Icon name={getStatusIcon(item?.status)} size={12} />
                    <span className="capitalize">{item?.status}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{new Date(item.timestamp)?.toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Target" size={12} />
                    <span>{item?.confidence}% confidence</span>
                  </span>
                  {item?.barcode && (
                    <span className="flex items-center space-x-1">
                      <Icon name="QrCode" size={12} />
                      <span className="font-data">{item?.barcode}</span>
                    </span>
                  )}
                </div>

                {item?.problematicIngredients?.length > 0 && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="AlertTriangle" size={12} className="text-warning" />
                    <span className="text-xs text-warning">
                      {item?.problematicIngredients?.length} problematic ingredient(s)
                    </span>
                  </div>
                )}

                {item?.note && (
                  <div className="bg-muted/50 rounded p-2 mt-2">
                    <p className="text-xs text-muted-foreground italic">
                      Note: {item?.note}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRecheck(item)}
                  iconName="RefreshCw"
                  title="Recheck product"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddNote(item)}
                  iconName="MessageSquare"
                  title="Add note"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteItem(item)}
                  iconName="Trash2"
                  title="Delete from history"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredHistory?.length === 0 && searchTerm && (
        <div className="p-8 text-center">
          <Icon name="Search" size={24} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No products found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default VerificationHistory;