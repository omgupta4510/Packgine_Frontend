import React, { useState } from 'react';
import { Edit, Save, X, AlertCircle, CheckCircle, DollarSign, Package, Palette, Ruler } from 'lucide-react';

interface ProductSummaryProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    broaderCategory: string;
    subcategory?: string;
    specifications: {
      material?: string;
      capacity?: { value: number; unit: string };
      dimensions?: { height: number; width: number; depth: number; unit: string };
      color?: string;
      minimumOrderQuantity: number;
    };
    pricing: {
      basePrice: number;
      currency: string;
    };
    features: string[];
    certifications: string[];
    missingFields: string[];
    similarProducts: Array<{
      id: string;
      name: string;
      similarity: number;
    }>;
    status: 'extracted' | 'reviewed' | 'approved' | 'rejected';
  };
  onUpdate: (productId: string, updates: any) => void;
  onApprove: (productId: string) => void;
  onReject: (productId: string) => void;
}

const ProductSummary: React.FC<ProductSummaryProps> = ({ 
  product, 
  onUpdate, 
  onApprove, 
  onReject 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const handleSave = () => {
    onUpdate(product.id, editedProduct);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setIsEditing(false);
  };

  const updateField = (field: string, value: any) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSpecification = (field: string, value: any) => {
    setEditedProduct(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  const updatePricing = (field: string, value: any) => {
    setEditedProduct(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedProduct.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="text-2xl font-bold border-b border-gray-300 pb-1 mb-2 w-full focus:outline-none focus:border-berlin-red-500"
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {product.category}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {product.broaderCategory}
            </span>
            {product.subcategory && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {product.subcategory}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        {isEditing ? (
          <textarea
            value={editedProduct.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-berlin-red-500"
          />
        ) : (
          <p className="text-gray-700">{product.description}</p>
        )}
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Material */}
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-gray-500" />
          <div>
            <label className="text-sm font-medium text-gray-700">Material</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProduct.specifications.material || ''}
                onChange={(e) => updateSpecification('material', e.target.value)}
                className="block w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-berlin-red-500"
              />
            ) : (
              <p className="text-sm text-gray-600">{product.specifications.material || 'Not specified'}</p>
            )}
          </div>
        </div>

        {/* Color */}
        <div className="flex items-center space-x-2">
          <Palette className="w-5 h-5 text-gray-500" />
          <div>
            <label className="text-sm font-medium text-gray-700">Color</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProduct.specifications.color || ''}
                onChange={(e) => updateSpecification('color', e.target.value)}
                className="block w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-berlin-red-500"
              />
            ) : (
              <p className="text-sm text-gray-600">{product.specifications.color || 'Not specified'}</p>
            )}
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-center space-x-2">
          <Ruler className="w-5 h-5 text-gray-500" />
          <div>
            <label className="text-sm font-medium text-gray-700">Capacity</label>
            {isEditing ? (
              <div className="flex space-x-1">
                <input
                  type="number"
                  value={editedProduct.specifications.capacity?.value || 0}
                  onChange={(e) => updateSpecification('capacity', {
                    ...editedProduct.specifications.capacity,
                    value: parseFloat(e.target.value) || 0
                  })}
                  className="w-16 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-berlin-red-500"
                />
                <input
                  type="text"
                  value={editedProduct.specifications.capacity?.unit || 'ml'}
                  onChange={(e) => updateSpecification('capacity', {
                    ...editedProduct.specifications.capacity,
                    unit: e.target.value
                  })}
                  className="w-12 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-berlin-red-500"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {product.specifications.capacity?.value ? 
                  `${product.specifications.capacity.value} ${product.specifications.capacity.unit}` : 
                  'Not specified'}
              </p>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-gray-500" />
          <div>
            <label className="text-sm font-medium text-gray-700">Price</label>
            {isEditing ? (
              <div className="flex space-x-1">
                <input
                  type="number"
                  step="0.01"
                  value={editedProduct.pricing.basePrice}
                  onChange={(e) => updatePricing('basePrice', parseFloat(e.target.value) || 0)}
                  className="w-20 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-berlin-red-500"
                />
                <select
                  value={editedProduct.pricing.currency}
                  onChange={(e) => updatePricing('currency', e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-berlin-red-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {product.pricing.currency} {product.pricing.basePrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Missing Fields Warning */}
      {product.missingFields.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">Missing Information</span>
          </div>
          <p className="text-sm text-yellow-700">
            The following fields need attention: {product.missingFields.join(', ')}
          </p>
        </div>
      )}

      {/* Similar Products Warning */}
      {product.similarProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Similar Products Found</span>
          </div>
          <div className="space-y-1">
            {product.similarProducts.map((similar) => (
              <p key={similar.id} className="text-sm text-blue-700">
                • {similar.name} ({Math.round(similar.similarity * 100)}% similar)
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {product.features.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
          <div className="flex flex-wrap gap-2">
            {product.features.map((feature, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {product.certifications.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
          <div className="flex flex-wrap gap-2">
            {product.certifications.map((cert, index) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          onClick={() => onReject(product.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            product.status === 'rejected' 
              ? 'bg-red-600 text-white' 
              : 'border border-red-600 text-red-600 hover:bg-red-50'
          }`}
        >
          {product.status === 'rejected' ? 'Rejected' : 'Reject'}
        </button>
        <button
          onClick={() => onApprove(product.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            product.status === 'approved' 
              ? 'bg-green-600 text-white' 
              : 'border border-green-600 text-green-600 hover:bg-green-50'
          } flex items-center space-x-2`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{product.status === 'approved' ? 'Approved' : 'Approve'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductSummary;
