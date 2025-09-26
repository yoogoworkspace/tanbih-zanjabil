import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';

const HalalCheckerCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScanHistory = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('halal_products')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setScanHistory(data || []);
      } catch (error) {
        console.error("Error fetching scan history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScanHistory();
  }, [user]);

  const handleNavigateToChecker = () => {
    navigate('/halal-checker');
  };

  const handleQuickScan = () => {
    navigate('/halal-checker');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'halal':
        return 'text-success bg-success/10 border-success/20';
      case 'haram':
        return 'text-error bg-error/10 border-error/20';
      case 'questionable':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'halal':
        return 'CheckCircle';
      case 'haram':
        return 'XCircle';
      case 'questionable':
        return 'AlertCircle';
      default:
        return 'HelpCircle';
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-islamic-moderate border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-success-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">Halal Checker</h3>
            <p className="font-caption text-sm text-muted-foreground">Product Verification</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="font-data text-lg font-bold text-success">127</p>
            <p className="font-caption text-xs text-muted-foreground">Products Scanned</p>
          </div>
        </div>
      </div>
      {/* Quick Scan Options */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleQuickScan}
          className="flex flex-col items-center p-3 h-auto rounded-xl"
        >
          <Icon name="Camera" size={20} className="mb-1" />
          <span className="text-xs">Barcode</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleQuickScan}
          className="flex flex-col items-center p-3 h-auto rounded-xl"
        >
          <Icon name="Type" size={20} className="mb-1" />
          <span className="text-xs">Text Input</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleQuickScan}
          className="flex flex-col items-center p-3 h-auto rounded-xl"
        >
          <Icon name="Image" size={20} className="mb-1" />
          <span className="text-xs">Photo</span>
        </Button>
      </div>
      {/* Recent Scans */}
      <div className="space-y-3 mb-4">
        <h4 className="font-medium text-sm text-foreground">Recent Scans</h4>
        {loading ? (
          <div className="text-center py-4"><p className="text-sm text-muted-foreground">Loading history...</p></div>
        ) : scanHistory.length > 0 ? (
          scanHistory.map((scan) => (
            <div
              key={scan.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => console.log('View scan details', scan.id)}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  name={getStatusIcon(scan.is_halal === true ? 'halal' : scan.is_halal === false ? 'haram' : 'questionable')}
                  size={16}
                  className={getStatusColor(scan.is_halal === true ? 'halal' : scan.is_halal === false ? 'haram' : 'questionable').split(' ')[0]}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{scan.product_name}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(scan.is_halal === true ? 'halal' : scan.is_halal === false ? 'haram' : 'questionable')}`}>
                  {scan.is_halal === true ? 'Halal' : scan.is_halal === false ? 'Haram' : 'Questionable'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No scans yet.</p>
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="default"
          className="flex-1 rounded-xl"
          onClick={handleNavigateToChecker}
          iconName="Search"
          iconPosition="left"
        >
          Open Checker
        </Button>
        <Button
          variant="outline"
          onClick={handleNavigateToChecker}
          iconName="History"
          iconPosition="left"
          className="rounded-xl"
        >
          History
        </Button>
      </div>
      <div className="mt-4 p-3 bg-success/5 rounded-xl border border-success/10">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="BookOpen" size={16} className="text-success" />
          <span className="font-medium text-sm text-foreground">Islamic References</span>
        </div>
        <p className="text-xs text-muted-foreground">
          All verifications include Qur'an and Hadith references for authentic guidance.
        </p>
      </div>
    </div>
  );
};

export default HalalCheckerCard;