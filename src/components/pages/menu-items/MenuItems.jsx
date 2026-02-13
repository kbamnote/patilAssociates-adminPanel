import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ChefHat, Tag, Star, Clock, DollarSign, Image as ImageIcon } from 'lucide-react';
import { 
  getAllMenuItems, 
  getMenuItemById, 
  updateMenuItem, 
  deleteMenuItem, 
  createMenuItem,
  getMenuItemsByCategory,
  getMenuItemsByDietaryType
} from '../../utils/Api';

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'appetizer',
    ingredients: [],
    dietaryOptions: [],
    isActive: true,
    image: '',
    cookingTime: 15
  });

  const categories = [
    'appetizer', 'main_course', 'dessert', 'beverage', 
    'alcoholic_beverage', 'non_alcoholic_beverage', 'specials'
  ];

  const dietaryOptions = [
    'vegetarian', 'vegan', 'gluten_free', 'dairy_free', 
    'nut_free', 'halal', 'kosher'
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await getAllMenuItems();
      setMenuItems(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to fetch menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = menuItems.filter(item =>
    (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.price?.toString().includes(searchTerm)) &&
    (selectedCategory === '' || item.category === selectedCategory)
  );

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      ingredients: item.ingredients || [],
      dietaryOptions: item.dietaryOptions || [],
      isActive: item.isActive,
      image: item.image || '',
      cookingTime: item.cookingTime || 15
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleView = (item) => {
    setCurrentItem(item);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(itemId);
        fetchMenuItems(); // Refresh the list
      } catch (err) {
        setError('Failed to delete menu item. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await updateMenuItem(currentItem._id, formData);
      } else {
        await createMenuItem(formData);
      }
      setShowModal(false);
      setCurrentItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'appetizer',
        ingredients: [],
        dietaryOptions: [],
        isActive: true,
        image: '',
        cookingTime: 15
      });
      fetchMenuItems(); // Refresh the list
    } catch (err) {
      setError('Failed to save menu item. Please try again.');
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-gray-600 mt-1">Manage restaurant menu items</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full"
              />
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentItem(null);
                setFormData({
                  name: '',
                  description: '',
                  price: 0,
                  category: 'appetizer',
                  ingredients: [],
                  dietaryOptions: [],
                  isActive: true,
                  image: '',
                  cookingTime: 15
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Item
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ChefHat className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-800">{menuItems.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-800">
                {menuItems.filter(item => item.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <Tag className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vegetarian</p>
              <p className="text-2xl font-semibold text-gray-800">
                {menuItems.filter(item => item.dietaryOptions?.includes('vegetarian')).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-semibold text-gray-800">
                ₹{menuItems.length > 0 
                  ? Math.round(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length)
                  : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredItems.map((item) => (
            <div 
              key={item._id} 
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                item.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm font-medium text-gray-800">₹{item.price}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(item)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                    title="Edit Item"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                    title="Delete Item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                    {item.category.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cooking Time:</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{item.cookingTime} min</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {item.dietaryOptions && item.dietaryOptions.length > 0 && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-600 mb-1">Dietary:</div>
                    <div className="flex flex-wrap gap-1">
                      {item.dietaryOptions.map((option, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                        >
                          {option.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-2">
                  <p className="text-sm text-gray-700 line-clamp-2">{item.description}</p>
                </div>
                
                {item.image && (
                  <div className="mt-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No menu items</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory ? 
                'No menu items match your filters.' : 
                'No menu items found in the system.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal for View/Edit Menu Item */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {isEditing ? 'Edit Menu Item' : 'Create New Menu Item'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
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

                <div className="grid grid-cols-2 gap-4">
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
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
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

                {currentItem && !isEditing && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item ID
                      </label>
                      <p className="text-gray-900 font-mono text-sm">{currentItem._id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created At
                      </label>
                      <p className="text-gray-900">
                        {currentItem.createdAt ? new Date(currentItem.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Updated At
                      </label>
                      <p className="text-gray-900">
                        {currentItem.updatedAt ? new Date(currentItem.updatedAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
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
      )}
    </div>
  );
};

export default MenuItems;