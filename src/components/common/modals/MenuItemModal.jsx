import React, { useState, useEffect } from 'react';

const MenuItemModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  item = null,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'appetizer',
    ingredients: [],
    dietaryOptions: [],
    isActive: true,
    cookingTime: 15
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    'appetizer', 'main_course', 'dessert', 'beverage', 
    'alcoholic_beverage', 'non_alcoholic_beverage', 'specials'
  ];

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten_free', 'dairy_free', 
    'nut_free', 'halal', 'kosher'
  ];

  useEffect(() => {
    if (item && isEditing) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        ingredients: item.ingredients || [],
        dietaryOptions: item.dietaryOptions || [],
        isActive: item.isActive,
        cookingTime: item.cookingTime || 15
      });
      if (item.image) {
        setImagePreview(item.image);
      }
    } else {
      resetForm();
    }
  }, [item, isEditing, isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'appetizer',
      ingredients: [],
      dietaryOptions: [],
      isActive: true,
      cookingTime: 15
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'price' ? parseFloat(value) : value)
    }));
  };

  const handleDietaryOptionChange = (option) => {
    setFormData(prev => ({
      ...prev,
      dietaryOptions: prev.dietaryOptions.includes(option)
        ? prev.dietaryOptions.filter(d => d !== option)
        : [...prev.dietaryOptions, option]
    }));
  };

  const handleIngredientChange = (e) => {
    const ingredients = e.target.value.split(',').map(i => i.trim()).filter(i => i);
    setFormData(prev => ({
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

  const handleSave = () => {
    const submitData = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'ingredients' || key === 'dietaryOptions') {
        formData[key].forEach(item => submitData.append(key, item));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    // Add image file if selected
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    onSave(submitData, item?._id);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditing ? 'Edit Menu Item' : 'Create New Menu Item'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cooking Time (min)
                </label>
                <input
                  type="number"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {(imagePreview || (item && item.image && !isEditing)) && (
                  <div className="flex items-center space-x-2">
                    <img 
                      src={imagePreview || item.image} 
                      alt="Preview" 
                      className="h-16 w-16 object-cover rounded-lg border"
                    />
                    {isEditing && (
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingredients (comma separated)
              </label>
              <input
                type="text"
                value={formData.ingredients.join(', ')}
                onChange={handleIngredientChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., chicken, tomatoes, cheese"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dietary Options
              </label>
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map(option => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.dietaryOptions.includes(option)}
                      onChange={() => handleDietaryOptionChange(option)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {option.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {isEditing ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;