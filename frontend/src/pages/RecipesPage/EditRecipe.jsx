import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Minus,
  X,
  Upload,
  Clock,
  Users,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BreadCrumb from "@/components/common/BreadCrumb";
import CategoryModal from "@/components/common/CategoryModal";
import { getRecipeById, updateRecipe } from "@/services/recipeService";
import { getAllFormattedCategories } from "@/services/categoryService";
import {
  searchIngredients,
} from "@/services/ingredientService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCloudinary } from "@/context/CloudinaryContext";
import { useAuth } from "@/context/AuthContext";

// Helper function to generate unique IDs
const generateUniqueId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

export default function EditRecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { uploadImage } = useCloudinary();

  // State for form data
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState("1");
  const [cookingTime, setCookingTime] = useState("");
  const [ingredients, setIngredients] = useState([
    {
      id: generateUniqueId(),
      name: "",
      amount: "",
      unit: "",
      ingredientId: null,
    },
  ]);
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);
  const [activeIngredientIndex, setActiveIngredientIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);  const [steps, setSteps] = useState([
    { id: generateUniqueId(), summary: "", detail: "", images: [] },
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(true);  const [recipeNotFound, setRecipeNotFound] = useState(false);
  
  // Memoized handlers to prevent re-renders and focus loss
  const handleDescriptionChange = useCallback((e) => {
    setDescription(e.target.value);
  }, []);

  // Load recipe data when component mounts
  useEffect(() => {
    const loadRecipe = async () => {
      try {
        console.log("Loading recipe with ID:", id);
        console.log("Current user:", user);
        setLoadingRecipe(true);
        const response = await getRecipeById(id);
        console.log("Recipe response:", response);
        if (response.status === 200 && response.data.success) {
          const recipe = response.data.data;
          console.log("Recipe data:", recipe);          
          
          // Handle both populated and non-populated author
          const authorId = typeof recipe.author === 'object' ? recipe.author._id : recipe.author;
          
          if (authorId !== user?._id) {
            console.log("❌ User is not author. Recipe author ID:", authorId, "Current user:", user?._id);
            toast.error("Bạn không có quyền chỉnh sửa công thức này");
            navigate("/recipes");
            return;
          } else {
            console.log("✅ User is the author, proceeding with edit form");
          }          
          
          setRecipeName(recipe.title || recipe.name || "");
          setDescription(recipe.description || "");
          setServings(recipe.servings?.toString() || "1");
          // Use 'time' field from backend model, fallback to 'cookingTime'
          setCookingTime((recipe.time || recipe.cookingTime)?.toString() || "");
          
          console.log("After setting state:");
          console.log("cookingTime state will be:", (recipe.time || recipe.cookingTime)?.toString() || "");
            // Set image
          if (recipe.image) {
            const imageUrl = Array.isArray(recipe.image) ? recipe.image[0] : recipe.image;
            setImagePreview(imageUrl);
            setImageFile(null); // Ensure no file is set initially for existing images
          }// Set ingredients
          if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
            const formattedIngredients = recipe.ingredients.map((ing, index) => ({
              id: `ingredient-${index}`,
              name: ing.name || (ing.ingredient?.name) || "",
              amount: ing.quantity?.toString() || "",
              unit: ing.unit || (ing.ingredient?.unit) || "",
              ingredientId: ing.ingredient?._id || ing.ingredient || null,
            }));
            setIngredients(formattedIngredients.length > 0 ? formattedIngredients : [
              { id: generateUniqueId(), name: "", amount: "", unit: "", ingredientId: null }
            ]);
          }

          // Set steps - handle both 'instructions' and 'steps' fields
          const stepsData = recipe.instructions || recipe.steps || [];
          if (Array.isArray(stepsData)) {            const formattedSteps = stepsData.map((instruction, index) => ({
              id: `step-${index}`,
              summary: instruction.summary || instruction.step || "",
              detail: instruction.detail || instruction.description || "",
              images: instruction.images || instruction.image || [],
            }));
            setSteps(formattedSteps.length > 0 ? formattedSteps : [
              { id: generateUniqueId(), summary: "", detail: "", time: "", images: [] }
            ]);
          }

          // Set categories
          if (recipe.categories && Array.isArray(recipe.categories)) {
            const categoryIds = recipe.categories
              .map(cat => {
                if (typeof cat === 'object' && cat._id) {
                  return cat._id;
                } else if (typeof cat === 'string') {
                  return cat;
                }
                return null;
              })
              .filter(Boolean);
            setSelectedCategories(categoryIds);
          }        } else {
          console.log("Recipe not found or API error:", response);
          setRecipeNotFound(true);
          toast.error("Không tìm thấy công thức");
        }
      } catch (error) {
        console.error("Error loading recipe:", error);
        setRecipeNotFound(true);
        toast.error("Có lỗi xảy ra khi tải công thức");
      } finally {
        setLoadingRecipe(false);
      }
    };    

    
    if (id && user) {
      loadRecipe();
    } else {
      if (!user) {
        setLoadingRecipe(false);
      } else if (!id) {
        navigate("/recipes");
      } else {
        setLoadingRecipe(false);
      }
    }
  }, [id, user, navigate, authLoading]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // setLoadingCategories(true);
        const response = await getAllFormattedCategories();
        if (response.data && response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh mục");
      } finally {
        // setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Search ingredients
  const handleIngredientSearch = useCallback(
    async (query, index) => {
      if (!query.trim() || query.length < 2) {
        setIngredientSuggestions([]);
        setActiveIngredientIndex(-1);
        return;
      }

      try {
        setIsSearching(true);
        setActiveIngredientIndex(index);
        const response = await searchIngredients(query);
        if (response.data && response.data.success) {
          setIngredientSuggestions(response.data.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error searching ingredients:", error);
        setIngredientSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Handle ingredient change
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;

    if (field === "name") {
      newIngredients[index].ingredientId = null;
      handleIngredientSearch(value, index);
    }

    setIngredients(newIngredients);
  };

  // Select ingredient from suggestions
  const handleSelectIngredient = (suggestion, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      name: suggestion.name,
      unit: suggestion.unit || "",
      ingredientId: suggestion._id,
    };
    setIngredients(newIngredients);
    setIngredientSuggestions([]);
    setActiveIngredientIndex(-1);
  };

  // Add/remove ingredients
  const addIngredient = () =>
    setIngredients([
      ...ingredients,
      { id: generateUniqueId(), name: "", amount: "", unit: "", ingredientId: null },
    ]);

  const removeIngredient = (idx) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== idx));
    }
  };

  // Handle steps
  const handleStepChange = (index, field, value) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };
  const addStep = () =>
    setSteps([
      ...steps,
      { id: generateUniqueId(), summary: "", detail: "", images: [] },
    ]);

  const removeStep = (idx) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== idx));
    }
  };

  // Handle categories
  const toggleCategory = (category) => {
    if (!category || !category._id || !category.name) {
      console.error("Invalid category object:", category);
      return;
    }

    const categoryId = category._id;
    
    setSelectedCategories((prev) => {
      if (!Array.isArray(prev)) {
        console.error("Invalid selectedCategories state:", prev);
        return [categoryId];
      }

      const isSelected = prev.some((id) => id === categoryId);
      const newCategories = isSelected
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      return newCategories;
    });
  };
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  // Handle step image upload
  const handleStepImageUpload = (stepIndex, files) => {
    const fileArray = Array.from(files).slice(0, 4); // Limit to 4 images
    const newSteps = [...steps];

    if (!newSteps[stepIndex].images) {
      newSteps[stepIndex].images = [];
    }

    // Limit total images to 4
    const remainingSlots = 4 - (newSteps[stepIndex].images?.length || 0);
    if (remainingSlots <= 0) {
      toast.error("Tối đa 4 hình ảnh cho mỗi bước");
      return;
    }

    const newFiles = fileArray.slice(0, remainingSlots);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newSteps[stepIndex].images.push({
          file: file,
          preview: e.target.result,
        });
        setSteps([...newSteps]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeStepImage = (stepIndex, imageIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].images.splice(imageIndex, 1);
    setSteps(newSteps);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!recipeName.trim()) {
        toast.error("Vui lòng nhập tên công thức");
        return;
      }

      if (!description.trim()) {
        toast.error("Vui lòng nhập mô tả công thức");
        return;
      }

      if (!cookingTime) {
        toast.error("Vui lòng nhập thời gian nấu");
        return;
      }

      // Validate ingredients
      const validIngredients = ingredients.filter(
        (ing) => ing.name.trim() && ing.amount.trim()
      );
      if (validIngredients.length === 0) {
        toast.error("Vui lòng thêm ít nhất một nguyên liệu");
        return;
      }

      // Validate steps
      const validSteps = steps.filter(
        (step) => step.summary.trim() && step.detail.trim()
      );
      if (validSteps.length === 0) {
        toast.error("Vui lòng thêm ít nhất một bước thực hiện");
        return;
      }      // Upload image if a new one is selected
      let imageUrl = null;
      if (imageFile) {
        // Upload new image file
        const uploadResult = await uploadImage(imageFile);
        imageUrl = uploadResult.secure_url;
      } else if (imagePreview && !imageFile) {
        // Keep existing image if no new file is selected and preview exists
        imageUrl = imagePreview;
      }
      // If imagePreview is null (image was removed), imageUrl will be null

      // Upload step images to Cloudinary
      const processedSteps = await Promise.all(
        validSteps.map(async (step) => {
          const processedImages = [];
          
          if (step.images && step.images.length > 0) {
            for (const image of step.images) {
              if (image.file) {
                // Upload new image file to Cloudinary
                try {
                  const uploadResult = await uploadImage(image.file);
                  processedImages.push(uploadResult.secure_url);
                } catch (error) {
                  console.error("Error uploading step image:", error);
                  toast.error(`Lỗi tải ảnh bước: ${error.message}`);
                }
              } else if (typeof image === 'string') {
                // Keep existing image URL
                processedImages.push(image);
              } else if (image.preview && !image.file) {
                // Handle existing images that might be in preview format
                processedImages.push(image.preview);
              }
            }
          }

          return {
            step: step.summary.trim(), // Changed from 'summary' to 'step' to match backend model
            description: step.detail.trim(), // Changed from 'detail' to 'description' to match backend model  
            images: processedImages,
          };
        })
      );      // Prepare recipe data
      const recipeData = {
        name: recipeName.trim(), // Changed from 'title' to 'name' to match backend model
        description: description.trim(),
        image: imageUrl ? [imageUrl] : [], // Send empty array if no image
        ingredients: validIngredients.map((ing) => ({
          name: ing.name.trim(),
          amount: parseFloat(ing.amount) || 1, // Changed default from 0 to 1 to avoid validation issues
          unit: ing.unit.trim(),
          ingredientId: ing.ingredientId,
        })),
        steps: processedSteps, // Use processed steps with uploaded images
        time: parseInt(cookingTime), // Changed from 'cookingTime' to 'time' to match backend model
        servings: parseInt(servings) || 1,
        categories: selectedCategories,
      };console.log("Updating recipe with data:", recipeData);

      const response = await updateRecipe(id, recipeData);
      console.log("Update response:", response);

      if (response.status === 200 && response.data?.success) {
        toast.success("Cập nhật công thức thành công!");
        navigate(`/recipes/${id}`);
      } else {
        console.log("Update failed - Response:", response);
        toast.error("Có lỗi xảy ra khi cập nhật công thức");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật công thức"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loadingRecipe) {
    return (
      <div className="max-w-7xl mx-auto py-10">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải công thức...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (recipeNotFound) {
    return (
      <div className="max-w-7xl mx-auto py-10">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">Không tìm thấy công thức</p>
            <button
              onClick={() => navigate("/recipes")}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Quay lại danh sách công thức
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="py-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-900 leading-tight">
          Chỉnh sửa công thức
        </h1>
        <p className="text-gray-800 mt-2">
          Cập nhật thông tin công thức nấu ăn của bạn
        </p>
      </div>

      {/* Main Form */}
      <div className="">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image Upload */}
            <div className="lg:col-span-1">
              <label className="block text-base font-medium text-gray-700 mb-3">
                Hình ảnh món ăn
              </label>
              <div className="relative group">
                <div className="bg-gradient-to-r from-amber-300 to-orange-300 rounded-xl aspect-square flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 hover:shadow-md">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors z-[9]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <label
                        htmlFor="image-upload"
                        className="absolute inset-0 cursor-pointer bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100"
                      >
                        <Upload className="w-8 h-8 text-white" />
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                    >
                      <ImageIcon className="w-12 h-12 text-gray-500 mb-3" />
                      <span className="text-gray-500 text-sm text-center">
                        Thêm hình ảnh món ăn
                      </span>
                    </label>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>

            {/* Recipe Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Tên công thức <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập tên món ăn"
                  required
                />
              </div>              
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  Mô tả công thức <span className="text-red-500">*</span>
                </label>                
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Mô tả ngắn gọn về món ăn..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Số phần ăn
                  </label>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => setServings(Math.max(1, parseInt(servings) - 1))}
                      className="px-3 py-4 border border-gray-300 rounded-l-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <input
                      type="number"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      className="w-full px-4 py-3 border-y border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center"
                      placeholder="1"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => setServings(parseInt(servings) + 1)}
                      className="px-3 py-4 border border-gray-300 rounded-r-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Thời gian nấu (phút) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="30"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Danh mục món ăn
                </label>
                
                {/* Selected categories display */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedCategories
                    .slice(0, 3) // Show only first 3 categories
                    .map((categoryId) => {
                      let categoryName = "Danh mục";
                      categories.forEach((group) => {
                        group.items.forEach((cat) => {
                          if (cat._id === categoryId) {
                            categoryName = cat.name;
                          }
                        });
                      });
                      
                      return (
                        <button
                          key={categoryId}
                          type="button"
                          className="px-4 py-2 rounded-full text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2 transition-all duration-200"
                          onClick={() => {
                            let categoryObject = null;
                            categories.forEach((group) => {
                              group.items.forEach((cat) => {
                                if (cat._id === categoryId) {
                                  categoryObject = cat;
                                }
                              });
                            });
                            if (categoryObject) {
                              toggleCategory(categoryObject);
                            }
                          }}
                        >
                          {categoryName}
                          <X className="w-4 h-4" />
                        </button>
                      );
                    })}
                  {selectedCategories.length > 3 && (
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                      +{selectedCategories.length - 3}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>                </div>                
                {/* Category Modal */}
                <CategoryModal
                  isOpen={showCategoryModal}
                  onClose={() => setShowCategoryModal(false)}
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  onClearAll={() => setSelectedCategories([])}
                />
              </div>
            </div>
          </div>

          {/* Ingredients and Steps */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Ingredients Section */}
            <div className="bg-gray-50 rounded-xl border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    1
                  </span>
                  Nguyên liệu
                </h3>
                <div className="space-y-3">
                  {ingredients.map((ingredient, idx) => (
                    <div
                      key={`ingredient-${idx}`}
                      className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Tên nguyên liệu"
                            value={ingredient.name}
                            onChange={(e) =>
                              handleIngredientChange(
                                idx,
                                "name",
                                e.target.value
                              )
                            }
                            className={`w-full p-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              ingredient.ingredientId
                                ? "border-green-500 bg-green-50"
                                : "border-gray-300"
                            }`}
                            required
                          />
                            {/* Ingredient suggestions dropdown */}
                          {ingredientSuggestions.length > 0 &&
                            activeIngredientIndex === idx && (
                              <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-b-md max-h-40 overflow-y-auto shadow-lg">
                                {ingredientSuggestions.map((suggestion) => (
                                  <button
                                    key={suggestion._id}
                                    type="button"
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                                    onClick={() =>
                                      handleSelectIngredient(suggestion, idx)
                                    }
                                  >
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-gray-800">{suggestion.name}</span>
                                      {suggestion.unit && (
                                        <span className="text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded">
                                          {suggestion.unit}
                                        </span>
                                      )}
                                    </div>
                                    {suggestion.nutrition && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {suggestion.nutrition.calories && `${suggestion.nutrition.calories} cal/100g`}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          
                          {/* Loading indicator */}
                          {isSearching && activeIngredientIndex === idx && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                              <svg
                                className="animate-spin h-4 w-4 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 100-16 8 8 0 000 16zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          )}

                          {/* Success indicator */}
                          {ingredient.ingredientId && (
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                              <span className="text-green-600 text-xs font-medium flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-20">
                        <input
                          type="text"
                          placeholder="Số lượng"
                          value={ingredient.amount}
                          onChange={(e) =>
                            handleIngredientChange(
                              idx,
                              "amount",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                          required
                        />
                      </div>
                      <div className="w-20">
                        <input
                          type="text"
                          placeholder="Đơn vị"
                          value={ingredient.unit}
                          onChange={(e) =>
                            handleIngredientChange(idx, "unit", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIngredient(idx)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        disabled={ingredients.length === 1}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-amber-500 hover:text-amber-500 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm nguyên liệu
                </button>
              </div>
            </div>

            {/* Steps Section */}
            <div className="bg-gray-50 rounded-xl border border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    2
                  </span>
                  Các bước thực hiện
                </h3>

                <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <div
                      key={`step-${idx}`}
                      className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-400"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            placeholder="Tóm tắt bước"
                            value={step.summary}
                            onChange={(e) =>
                              handleStepChange(idx, "summary", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                            required
                          />                          <textarea
                            placeholder="Mô tả chi tiết cách thực hiện..."
                            value={step.detail}
                            onChange={(e) =>
                              handleStepChange(idx, "detail", e.target.value)
                            }
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          
                          {/* Step Images */}
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hình ảnh bước (tùy chọn)
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {step.images &&
                                step.images.map((image, imageIdx) => (
                                  <div
                                    key={imageIdx}
                                    className="relative w-20 h-20"
                                  >
                                    <img
                                      src={image.preview || image}
                                      alt={`Step ${idx + 1} image ${imageIdx + 1}`}
                                      className="w-full h-full object-cover rounded-md border border-gray-300"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeStepImage(idx, imageIdx)
                                      }
                                      className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}

                              {(!step.images || step.images.length < 4) && (
                                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleStepImageUpload(idx, e.target.files)
                                    }
                                    className="hidden"
                                  />
                                  <ImageIcon className="w-6 h-6 text-gray-400" />
                                  <span className="text-xs text-gray-500 mt-1">
                                    {step.images?.length || 0}/4
                                  </span>
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeStep(idx)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          disabled={steps.length === 1}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addStep}
                  className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-yellow-500 hover:text-yellow-500 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Thêm bước thực hiện
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 pb-20 items-center justify-end">
            <button
              type="button"
              onClick={() => navigate(`/recipes/${id}`)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 100-16 8 8 0 000 16zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật công thức"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
