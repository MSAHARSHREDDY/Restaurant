import React, { useState, useEffect } from 'react';
import { 
  getMenuItems, 
  getMenuCategories, 
  updateMenuItemInStorage, 
  deleteMenuItemInStorage, 
  addMenuItemInStorage,
  addMenuCategoryInStorage,
  updateMenuCategoryInStorage,
  deleteMenuCategoryInStorage
} from '../../api/client';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  AlertTriangle, 
  ChefHat, 
  ToggleLeft, 
  ToggleRight, 
  Sparkles, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  FolderOpen 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface MenuItem {
  id: number;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  spicy: boolean;
  prepTime: string;
  image: string;
  rating?: number;
}

interface Category {
  id: string;
  name: string;
}

export function AdminMenu() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Add/Edit Meal Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  // Fields state for Meal
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('199');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('15 min');
  const [spicy, setSpicy] = useState(false);
  const [image, setImage] = useState('');

  // Category Management Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Custom delete confirmation modal states
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<Category | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const catsData = await getMenuCategories();
      setCategories(catsData);
      
      const itemsData = await getMenuItems();
      setItems(itemsData);
      
      if (catsData.length > 0 && !categoryId) {
        setCategoryId(catsData[0].id);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load menu details.');
      setLoading(false);
    }
  };

  // Sync with React-Query cache to update customer-facing pages instantly
  const refreshMainQueries = () => {
    try {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (e) {
      console.warn("React Query client context mismatch", e);
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setCategoryId(categories[0]?.id || 'veg-starters');
    setPrice('199');
    setDescription('');
    setPrepTime('15 min');
    setSpicy(false);
    setImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategoryId(item.categoryId);
    setPrice(item.price.toString());
    setDescription(item.description);
    setPrepTime(item.prepTime);
    setSpicy(item.spicy);
    setImage(item.image);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload = {
      name,
      categoryId,
      price: Number(price),
      description,
      prepTime,
      spicy,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
      rating: 4.8
    };

    try {
      if (editingItem) {
        const updatedObj = { ...editingItem, ...payload };
        await updateMenuItemInStorage(updatedObj);
        toast.success("In-flight meal updated!");
      } else {
        await addMenuItemInStorage(payload);
        toast.success("New in-flight meal added successfully!");
      }
      setIsFormOpen(false);
      refreshMainQueries();
      const updated = await getMenuItems();
      setItems(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to commit menu database change.");
    }
  };

  // --- Dynamic Category Actions ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newCategoryName.trim();
    if (!cleanName) return;

    // Generate unique slug id
    const newId = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check duplication
    if (categories.some(c => c.id === newId)) {
      toast.error("A category with a similar slug title already exists.");
      return;
    }

    try {
      const newCatObj = { id: newId, name: cleanName };
      await addMenuCategoryInStorage(newCatObj);
      toast.success(`Category "${cleanName}" added dynamically.`);
      setNewCategoryName('');
      refreshMainQueries();
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category schema.");
    }
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setEditingCategoryName(cat.name);
  };

  const handleSaveCategory = async (catId: string) => {
    const cleanName = editingCategoryName.trim();
    if (!cleanName) return;

    try {
      await updateMenuCategoryInStorage({ id: catId, name: cleanName });
      toast.success("Category tag renamed successfully.");
      setEditingCategory(null);
      refreshMainQueries();
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update category.");
    }
  };

  const handleDeleteCategory = (categoryObj: Category) => {
    setDeleteCategoryConfirm(categoryObj);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1); // reset pagination on filters
  };

  const handleCategoryFilterChange = (val: string) => {
    setFilterCategory(val);
    setCurrentPage(1); // reset pagination on filters
  };

  // Combined filters
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Paginated List calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="text-white p-8">Loading Flight Cuisine Menu...</div>;

  return (
    <div className="space-y-8">
      {/* Upper header section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-gradient-to-r from-dark-900 to-dark-950 border border-white/10 rounded-2xl p-6 shadow-xl">
        <div>
          <h3 className="text-3xl font-serif text-white mb-2 flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-gold-500" />
            In-Flight Meal Configuration
          </h3>
          <p className="text-gray-400 text-sm">Create meals, configure pricing, and manage category groups dynamically.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          {/* Manage Categories CTA */}
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 font-medium px-4 py-3 rounded-xl transition-all cursor-pointer active:scale-95 text-sm"
          >
            <FolderOpen className="w-4 h-4 text-gold-400" />
            <span>Manage Categories</span>
          </button>
          {/* Add New Meal CTA */}
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-dark-950 font-bold px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-gold-500/20 active:scale-95 text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Meal</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search meals..." 
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-gold-500/50 transition-colors text-sm"
          />
        </div>
        <div>
          <select 
            value={filterCategory} 
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold-500/50 transition-colors text-sm cursor-pointer"
          >
            <option value="all">All Food & Beverage Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="bg-dark-900 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-gray-400 font-mono">
          <span>Match Count:</span>
          <span className="text-gold-500 font-bold text-sm">{filteredItems.length} listed</span>
        </div>
      </div>

      {/* Meals Table with Pagination */}
      <div className="bg-dark-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-xs uppercase text-white border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Dish Details</th>
                <th className="px-6 py-4">Cuisine Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map(item => {
                const categoryObj = categories.find(c => c.id === item.categoryId);
                return (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-14 h-14 object-cover rounded-lg border border-white/10 shrink-0" 
                        />
                        <div>
                          <p className="text-white font-medium text-base">{item.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1 max-w-sm mt-0.5">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="bg-white/5 text-gray-300 font-mono text-xs px-2.5 py-1 rounded-md border border-white/5 capitalize">
                        {categoryObj ? categoryObj.name : item.categoryId.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gold-500 font-bold text-base">₹{item.price}</span>
                    </td>
                    <td className="px-6 py-4 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <span className="text-gold-500 font-bold">⏱</span> {item.prepTime}
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.spicy ? (
                          <span className="text-red-400 uppercase tracking-widest text-[9px] bg-red-400/10 px-1.5 py-0.5 rounded font-mono font-bold">🔥 Spicy</span>
                        ) : (
                          <span className="text-blue-400 uppercase tracking-widest text-[9px] bg-blue-400/10 px-1.5 py-0.5 rounded font-mono">Mild</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 bg-white/5 hover:bg-gold-500 hover:text-dark-950 transition-all rounded-lg text-gray-300 cursor-pointer"
                          title="Edit properties"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-white/5 hover:bg-red-500 hover:text-white transition-all rounded-lg text-gray-300 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500">
                    <AlertTriangle className="w-10 h-10 text-yellow-500/55 mx-auto mb-3" />
                    No culinary meals match your filter. Try adjusting query terms.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Footer bar */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-white/3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Showing <span className="text-white font-bold">{startIndex + 1}</span> to <span className="text-white font-bold">{Math.min(startIndex + itemsPerPage, filteredItems.length)}</span> of <span className="font-mono text-gold-500 font-bold">{filteredItems.length}</span> meals
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-gray-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    currentPage === i + 1 
                      ? 'bg-gold-500 text-dark-950 font-bold border border-gold-500' 
                      : 'hover:bg-white/5 text-gray-400 border border-transparent'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-gray-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DYNAMIC CATEGORY MANAGEMENT MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-dark-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[999]">
          <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex justify-between items-center bg-white/5 px-6 py-4 border-b border-white/10">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-gold-500" />
                Category Configuration
              </h4>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List and Actions scroll area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              <p className="text-xs text-gray-400">
                Configure global cuisine groups. Renaming category tags changes user lists, while deleting deletes assigned meals.
              </p>

              {/* Add category inline bar */}
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New Category, e.g. Desserts"
                  className="flex-grow bg-dark-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-gold-500/50"
                  required
                />
                <button
                  type="submit"
                  className="bg-gold-500 hover:bg-gold-400 text-dark-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add List
                </button>
              </form>

              {/* Existing Categories List */}
              <div className="space-y-2">
                <h5 className="text-xs uppercase tracking-wider text-gray-500 font-bold">Category Registries</h5>
                <div className="divide-y divide-white/5 border border-white/5 rounded-xl bg-dark-950 overflow-hidden">
                  {categories.map(cat => (
                    <div key={cat.id} className="p-3.5 flex items-center justify-between group">
                      {editingCategory?.id === cat.id ? (
                        <div className="flex items-center gap-2 w-full max-w-md">
                          <input 
                            type="text" 
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            className="bg-dark-900 border border-gold-500/40 rounded px-2.5 py-1 text-sm text-white outline-none focus:border-gold-500 w-full"
                          />
                          <button
                            onClick={() => handleSaveCategory(cat.id)}
                            className="text-xs bg-emerald-500 text-white font-bold px-3 py-1.5 rounded cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-1.5 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <span className="text-sm font-semibold text-white">{cat.name}</span>
                            <span className="text-[10px] font-mono text-gray-500 block">ID Slug: {cat.id}</span>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={() => handleStartEditCategory(cat)}
                              className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-gold-500 rounded transition-colors cursor-pointer"
                              title="Rename Category"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat)}
                              className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white/5 px-6 py-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="bg-white/5 hover:bg-white/10 text-gray-300 font-bold px-5 py-2 rounded-xl text-sm transition-all cursor-pointer"
              >
                Close Control Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT/ADD MEAL WINDOW DIALOG */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-dark-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
          <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex justify-between items-center bg-white/5 px-6 py-4 border-b border-white/10">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-500" />
                {editingItem ? "Edit flight meal" : "Create new flight meal"}
              </h4>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/5 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5 font-bold">Meal Title *</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Flight Malai Tikka"
                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-gold-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5 font-bold">Menu Category</label>
                  <select 
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-gold-500/50 text-sm cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5 font-bold">Price (INR) *</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="299"
                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-gold-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5 font-bold">Estimated Prep Time</label>
                  <input 
                    type="text" 
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="15 min"
                    className="w-full bg-dark-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-gold-500/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5 font-bold">Meal Banner Image URL</label>
                <input 
                  type="text" 
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Paste Unsplash meal link or default set automatically"
                  className="w-full bg-dark-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-gold-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1.5 font-bold">Flavour Description *</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="Describe the spice levels, ingredients and texture served to consumers..."
                  className="w-full bg-dark-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-white outline-none focus:border-gold-500/50 text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t border-white/5">
                <div>
                  <span className="block text-xs uppercase tracking-widest text-gray-400 font-bold">Spicy Level</span>
                  <span className="text-[11px] text-gray-500">Enable if dish contains excessive peppers, chilis or spices</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSpicy(!spicy)}
                  className="text-gold-500 hover:text-gold-400 transition-colors"
                >
                  {spicy ? (
                    <div className="flex items-center gap-1">
                      <ToggleRight className="w-9 h-9 text-red-500" />
                      <span className="text-xs font-bold text-red-400 uppercase">Spicy</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <ToggleLeft className="w-9 h-9 text-gray-400" />
                      <span className="text-xs font-bold text-gray-400 uppercase font-mono">Mild</span>
                    </div>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="border border-white/10 px-4 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-500 text-dark-950 font-bold px-5 py-2 rounded-lg text-sm hover:bg-gold-400 hover:shadow-lg transition-all"
                >
                  {editingItem ? "Update Meal Details" : "Publish to Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REUSABLE STATE-BASED DELETION CONFIRMATION DIALOG FOR MEALS */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 bg-dark-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="bg-dark-900 border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 border-b border-white/10 pb-3">
              <AlertTriangle className="w-6 h-6 shrink-0 text-red-500" />
              <h4 className="text-lg font-serif text-white font-medium">Remove Culinary Meal</h4>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Are you sure you want to remove this exclusive menu item? This action is immediate and will withdraw the choice from consumer selection.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium px-4 py-2 rounded-xl text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const idToDel = deleteConfirmId;
                  setDeleteConfirmId(null);
                  try {
                    await deleteMenuItemInStorage(idToDel);
                    toast.success("Meal removed successfully.");
                    refreshMainQueries();
                    const updated = await getMenuItems();
                    setItems(updated);
                    const totalPages = Math.ceil(updated.length / itemsPerPage);
                    if (currentPage > totalPages && totalPages > 0) {
                      setCurrentPage(totalPages);
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to delete this item.");
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-red-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE STATE-BASED DELETION CONFIRMATION DIALOG FOR CATEGORIES */}
      {deleteCategoryConfirm !== null && (
        <div className="fixed inset-0 bg-dark-950/85 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="bg-dark-900 border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 border-b border-white/10 pb-3">
              <AlertTriangle className="w-6 h-6 shrink-0 text-red-500" />
              <h4 className="text-lg font-serif text-white font-medium">Purge Menu Category</h4>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              WARNING: Are you sure you want to delete <strong className="text-white">"{deleteCategoryConfirm.name}"</strong>? This will also instantly purge ALL in-flight meals assigned to this category! This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCategoryConfirm(null)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium px-4 py-2 rounded-xl text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const catToDel = deleteCategoryConfirm;
                  setDeleteCategoryConfirm(null);
                  try {
                    await deleteMenuCategoryInStorage(catToDel.id);
                    toast.success(`Category "${catToDel.name}" and its dynamic meals removed.`);
                    refreshMainQueries();
                    loadAll();
                  } catch (err) {
                    console.error(err);
                    toast.error("Error purging category sequence.");
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-red-500/20"
              >
                Purge All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
