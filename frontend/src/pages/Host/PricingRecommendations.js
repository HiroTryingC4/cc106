import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';

const PricingRecommendations = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [units, setUnits] = useState([]);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/units', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUnits(data.units);
        if (data.units.length > 0) {
          setSelectedUnit(data.units[0].id);
          fetchRecommendations(data.units[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (unitId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/pricing/${unitId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      addToast('Error loading pricing recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnitChange = (unitId) => {
    setSelectedUnit(unitId);
    fetchRecommendations(unitId);
  };

  const applyRecommendation = async (price) => {
    if (!window.confirm(`Update price to ₱${price}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/host/units/${selectedUnit}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pricePerNight: price })
      });

      const data = await response.json();
      if (data.success) {
        addToast('Price updated successfully!', 'success');
        fetchUnits();
        fetchRecommendations(selectedUnit);
      } else {
        addToast(data.message || 'Failed to update price', 'error');
      }
    } catch (error) {
      addToast('Error updating price', 'error');
    }
  };

  if (loading && !recommendations) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (units.length === 0) {
    return (
      <DashboardLayout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No properties found</p>
            <p className="text-sm text-gray-400">Add a property to get pricing recommendations</p>
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  const currentUnit = units.find(u => u.id === selectedUnit);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Pricing Recommendations</h1>
        <p className="text-gray-600 mt-2">Optimize your pricing with data-driven insights</p>
      </div>

      {/* Unit Selector */}
      <Card className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Property
        </label>
        <select
          value={selectedUnit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {units.map(unit => (
            <option key={unit.id} value={unit.id}>
              {unit.name} - Current: ₱{unit.pricePerNight}/night
            </option>
          ))}
        </select>
      </Card>

      {recommendations && (
        <>
          {/* Dynamic Pricing Suggestion */}
          <Card className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  💡 Recommended Price
                </h2>
                <p className="text-sm text-gray-600">
                  Based on market analysis and demand patterns
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  ₱{recommendations.suggestedPrice}
                </div>
                <div className="text-sm text-gray-600">per night</div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📊</span>
                <span className="font-semibold">Price Comparison</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Current Price</p>
                  <p className="font-bold text-lg">₱{currentUnit.pricePerNight}</p>
                </div>
                <div>
                  <p className="text-gray-600">Suggested Price</p>
                  <p className="font-bold text-lg text-blue-600">₱{recommendations.suggestedPrice}</p>
                </div>
                <div>
                  <p className="text-gray-600">Potential Change</p>
                  <p className={`font-bold text-lg ${recommendations.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {recommendations.priceChange >= 0 ? '+' : ''}{recommendations.priceChange}%
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={() => applyRecommendation(recommendations.suggestedPrice)}>
              Apply Recommended Price
            </Button>
          </Card>

          {/* Market Analysis */}
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              📈 Market Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Average Market Price</p>
                <p className="text-2xl font-bold">₱{recommendations.marketAnalysis.averagePrice}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on {recommendations.marketAnalysis.sampleSize} similar properties
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Occupancy Rate</p>
                <p className="text-2xl font-bold">{recommendations.marketAnalysis.occupancyRate}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {recommendations.marketAnalysis.occupancyRate >= 70 ? 'High demand' : 'Moderate demand'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Demand Level</p>
                <p className="text-2xl font-bold capitalize">{recommendations.marketAnalysis.demandLevel}</p>
                <p className="text-xs text-gray-500 mt-1">Current market conditions</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Competition</p>
                <p className="text-2xl font-bold">{recommendations.marketAnalysis.competitorCount}</p>
                <p className="text-xs text-gray-500 mt-1">Similar properties nearby</p>
              </div>
            </div>
          </Card>

          {/* Competitor Pricing */}
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🏆 Competitor Pricing Insights
            </h2>
            <div className="space-y-3">
              {recommendations.competitorPricing.map((comp, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{comp.name}</p>
                    <p className="text-sm text-gray-600">{comp.type} • {comp.bedrooms} bed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₱{comp.price}</p>
                    <p className="text-xs text-gray-500">per night</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Seasonal Recommendations */}
          <Card className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🌤️ Seasonal Pricing Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.seasonalPricing.map((season, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{season.season}</h3>
                    <span className="text-sm text-gray-600">{season.months}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Suggested Price:</span>
                    <span className="text-xl font-bold text-blue-600">₱{season.suggestedPrice}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{season.reason}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue Optimization Tips */}
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              💰 Revenue Optimization Tips
            </h2>
            <div className="space-y-3">
              {recommendations.optimizationTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <p className="font-semibold mb-1">{tip.title}</p>
                    <p className="text-sm text-gray-700">{tip.description}</p>
                    {tip.impact && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        Potential impact: {tip.impact}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
};

export default PricingRecommendations;
