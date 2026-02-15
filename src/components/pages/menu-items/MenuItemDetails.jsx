import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChefHat, Tag, Star, Clock, DollarSign, Image as ImageIcon, Edit, Save, X, Calendar, User } from 'lucide-react';
import { getMenuItemById, updateMenuItem } from '../../utils/Api';

const MenuItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchMenuItemDetails();
  }, [id]);

  const fetchMenuItemDetails = async () => {
    try {
      setLoading(true);
      const response = await getMenuItemById(id);
      console.log('Menu item data:', response.data.data);
      setMenuItem(response.data.data);
      setEditForm({
        name: response.data.data.name,
        description: response.data.data.description,
        price: response.data.data.price,
        category: response.data.data.category,
        ingredients: response.data.data.ingredients || [],
        dietaryOptions: response.data.data.dietaryOptions || [],
        isActive: response.data.data.isActive,
        cookingTime: response.data.data.cookingTime || 15
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching menu item details:', err);
      setError('Failed to load menu item details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      appetizer: 'bg-blue-100 text-blue-800',
      main_course: 'bg-green-100 text-green-800',
      dessert: 'bg-purple-100 text-purple-800',
      beverage: 'bg-yellow-100 text-yellow-800',
      alcoholic_beverage: 'bg-red-100 text-red-800',
      'non_alcoholic_beverage': 'bg-indigo-100 text-indigo-800',
      specials: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setImagePreview(null);
    setImageFile(null);
    // Reset form to original values
    setEditForm({
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      ingredients: menuItem.ingredients || [],
      dietaryOptions: menuItem.dietaryOptions || [],
      isActive: menuItem.isActive,
      cookingTime: menuItem.cookingTime || 15
    });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(editForm).forEach(key => {
        if (key === 'ingredients' || key === 'dietaryOptions') {
          editForm[key].forEach(item => formData.append(key, item));
        } else {
          formData.append(key, editForm[key]);
        }
      });

      // Add image file if selected
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await updateMenuItem(id, formData);
      console.log('Update response:', response.data);
      setMenuItem(response.data.data);
      setIsEditing(false);
      setImagePreview(null);
      setImageFile(null);
      alert('Menu item updated successfully!');
    } catch (err) {
      console.error('Error updating menu item:', err);
      alert('Failed to update menu item. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDietaryOptionChange = (option) => {
    setEditForm(prev => ({
      ...prev,
      dietaryOptions: prev.dietaryOptions.includes(option)
        ? prev.dietaryOptions.filter(d => d !== option)
        : [...prev.dietaryOptions, option]
    }));
  };

  const handleIngredientChange = (e) => {
    const ingredients = e.target.value.split(',').map(i => i.trim()).filter(i => i);
    setEditForm(prev => ({
      ...prev,
      ingredients
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={fetchMenuItemDetails}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Menu item not found</h3>
        <p className="text-gray-500 mt-1">The menu item you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div>
              <p className="text-gray-600 mt-1">Menu Item ID: {menuItem._id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            )}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${menuItem.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {menuItem.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Menu Item Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Menu Item Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="text-gray-900 text-lg font-medium">{menuItem.name}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                {isEditing ? (
                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <div className="text-gray-900">{menuItem.description}</div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Price</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-900 font-medium">₹{menuItem.price}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                  {isEditing ? (
                    <select
                      value={editForm.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="appetizer">Appetizer</option>
                      <option value="main_course">Main Course</option>
                      <option value="dessert">Dessert</option>
                      <option value="beverage">Beverage</option>
                      <option value="alcoholic_beverage">Alcoholic Beverage</option>
                      <option value="non_alcoholic_beverage">Non-Alcoholic Beverage</option>
                      <option value="specials">Specials</option>
                    </select>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(menuItem.category)}`}>
                      {menuItem.category.replace('_', ' ')}
                    </span>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Cooking Time</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.cookingTime}
                      onChange={(e) => handleInputChange('cookingTime', parseInt(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-900">{menuItem.cookingTime} min</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Ingredients</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.ingredients.join(', ')}
                    onChange={handleIngredientChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., chicken, tomatoes, cheese"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {menuItem.ingredients && menuItem.ingredients.map((ingredient, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Dietary Options</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-2">
                    {['vegetarian', 'vegan', 'gluten_free', 'dairy_free', 'nut_free', 'halal', 'kosher'].map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.dietaryOptions.includes(option)}
                          onChange={() => handleDietaryOptionChange(option)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {option.replace('_', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {menuItem.dietaryOptions && menuItem.dietaryOptions.map((option, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {option.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Image</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imagePreview && (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-16 w-16 object-cover rounded-lg border"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Image */}
          {(menuItem.image || imagePreview) && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Item Image</h2>
              <img 
                src={imagePreview || menuItem.image} 
                alt={menuItem.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Status */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Status</span>
                {isEditing ? (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${menuItem.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {menuItem.isActive ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Metadata</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                <div className="text-gray-900">{new Date(menuItem.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                <div className="text-gray-900">{new Date(menuItem.updatedAt).toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Item ID</label>
                <div className="text-gray-900 font-mono text-sm">{menuItem._id}</div>
              </div>
              {menuItem.__v !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Version</label>
                  <div className="text-gray-900">{menuItem.__v}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemDetails;