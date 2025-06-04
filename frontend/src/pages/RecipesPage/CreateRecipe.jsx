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
import { createRecipe } from "@/services/recipeService";
import { getAllFormattedCategories } from "@/services/categoryService";
import {
  searchIngredients,
  getIngredientUnits,
} from "@/services/ingredientService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCloudinary } from "../../context/CloudinaryContext";

// Helper function to generate unique IDs
const generateUniqueId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

export default function CreateRecipeForm() {
  const navigate = useNavigate();
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
  const [isSearching, setIsSearching] = useState(false);
  const [steps, setSteps] = useState([
    { id: generateUniqueId(), summary: "", detail: "", time: "", images: [] },
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]); // Khởi tạo là mảng rỗng
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [visibleCategoryCount] = useState(5);
  const [ingredientSearchTimeout, setIngredientSearchTimeout] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadImage } = useCloudinary();

  // Tạo danh sách đơn vị động bao gồm cả đơn vị từ database
  const getDynamicIngredientUnits = (currentIngredient) => {
    const standardUnits = getIngredientUnits();

    // Nếu nguyên liệu có đơn vị từ database và không có trong danh sách chuẩn
    if (currentIngredient?.unit && currentIngredient.ingredientId) {
      const unitExists = standardUnits.some(
        (unit) => unit.value === currentIngredient.unit
      );
      if (!unitExists) {
        return [
          { value: currentIngredient.unit, label: currentIngredient.unit },
          ...standardUnits,
        ];
      }
    }

    return standardUnits;
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getAllFormattedCategories();
        if (response.data?.success) {
          // Validate and transform the data structure
          const categoriesData = response.data.data;
          if (Array.isArray(categoriesData)) {
            console.log("Fetched categories:", categoriesData);
            setCategories(
              categoriesData.filter(
                (cat) => cat && cat.key && cat.name && Array.isArray(cat.items)
              )
            );
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh mục");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchIngredient = useCallback(async (value, idx) => {
    if (value.length >= 1) {
      setIsSearching(true);
      setActiveIngredientIndex(idx);
      try {
        const response = await searchIngredients(value);
        if (response.data.success) {
          setIngredientSuggestions(response.data.data);
        } else {
          setIngredientSuggestions([]);
        }
      } catch (error) {
        console.error("Error searching ingredients:", error);
        toast.error("Không thể tìm kiếm nguyên liệu");
      } finally {
        setIsSearching(false);
      }
    } else {
      setIngredientSuggestions([]);
      setActiveIngredientIndex(-1);
    }
  }, []);
  // Xử lý khi người dùng chọn một nguyên liệu từ kết quả tìm kiếm
  const handleSelectIngredient = (ingredient, idx) => {
    const newIngredients = [...ingredients];
    newIngredients[idx].name = ingredient.name;
    newIngredients[idx].ingredientId = ingredient._id; // Lưu ID của nguyên liệu để gửi lên backend

    // Luôn lấy đơn vị từ database - bắt buộc sử dụng đơn vị có sẵn
    newIngredients[idx].unit = ingredient.unit || ""; // Sử dụng đơn vị từ DB, nếu không có thì để trống

    setIngredients(newIngredients);
    setIngredientSuggestions([]);
    setActiveIngredientIndex(-1);

    // Hiển thị thông báo thành công
    const unitText = ingredient.unit ? ` (${ingredient.unit})` : "";
    toast.success(`Đã chọn nguyên liệu: ${ingredient.name}${unitText}`);
  };

  // Xử lý thay đổi thông tin nguyên liệu
  const handleIngredientChange = (idx, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[idx][field] = value;
    setIngredients(newIngredients);

    // Nếu field là name, thực hiện tìm kiếm với debounce để giảm số lượng API calls
    if (field === "name") {
      // Clear existing timeout
      if (ingredientSearchTimeout) {
        clearTimeout(ingredientSearchTimeout);
      }

      // Reset ingredient ID when user changes name manually
      if (newIngredients[idx].ingredientId) {
        newIngredients[idx].ingredientId = null;
        setIngredients(newIngredients);
      }

      if (value.length >= 1) {
        // Set new timeout with appropriate delay
        const timeoutId = setTimeout(() => {
          handleSearchIngredient(value, idx);
        }, 200);

        setIngredientSearchTimeout(timeoutId);
      } else {
        setIngredientSuggestions([]);
        setActiveIngredientIndex(-1);
      }
    }
  };

  const addIngredient = () => {
    // Thêm nguyên liệu trống mới với cấu trúc đầy đủ
    setIngredients([
      ...ingredients,
      {
        id: generateUniqueId(), // Thêm ID duy nhất cho nguyên liệu mới
        name: "",
        amount: "",
        unit: "",
        ingredientId: null, // Thêm trường ingredientId để theo dõi nguyên liệu từ database
      },
    ]);
  };
  const removeIngredient = (idx) =>
    setIngredients(ingredients.filter((_, i) => i !== idx));
  const handleStepChange = (idx, field, value) => {
    const newSteps = [...steps];
    newSteps[idx][field] = value;
    setSteps(newSteps);
  };

  const handleStepImageUpload = (idx, files) => {
    // Limit to max 4 images per step
    const fileArray = Array.from(files).slice(0, 4);
    const newSteps = [...steps];

    // Initialize images array if not existing
    if (!newSteps[idx].images) {
      newSteps[idx].images = [];
    }

    // Limit total images to 4
    const remainingSlots = 4 - (newSteps[idx].images?.length || 0);
    if (remainingSlots <= 0) {
      toast.error("Tối đa 4 hình ảnh cho mỗi bước");
      return;
    }

    const newFiles = fileArray.slice(0, remainingSlots);

    // Create image previews
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newSteps[idx].images.push({
          file: file,
          preview: e.target.result,
        });
        setSteps([...newSteps]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeStepImage = (stepIdx, imageIdx) => {
    const newSteps = [...steps];
    newSteps[stepIdx].images.splice(imageIdx, 1);
    setSteps(newSteps);
  };

  const addStep = () =>
    setSteps([
      ...steps,
      { id: generateUniqueId(), summary: "", detail: "", time: "", images: [] },
    ]);
  const removeStep = (idx) => setSteps(steps.filter((_, i) => i !== idx));
  const toggleCategory = (category) => {
    // Validate input
    if (!category || !category._id || !category.name) {
      console.error("Invalid category object:", category);
      return;
    }

    const categoryId = category._id;
    console.log("Toggling category:", category.name, "with ID:", categoryId);
    console.log("Current selected categories:", selectedCategories);

    setSelectedCategories((prev) => {
      // Validate current state
      if (!Array.isArray(prev)) {
        console.error("Invalid selectedCategories state:", prev);
        return [categoryId];
      }

      // Check if category is already selected using exact comparison
      const isSelected = prev.some((id) => id === categoryId);
      console.log("Is category already selected?", isSelected);

      // Create new array based on selection status
      const newCategories = isSelected
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];

      console.log("New selected categories:", newCategories);
      return newCategories;
    });
  };

  const openCategoryModal = () => {
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
  };

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
    setImagePreview(null);
    setImageFile(null);
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("🚀 Starting recipe creation...");
    console.log("📝 Form data validation:");
    console.log("- Recipe name:", recipeName);
    console.log("- Description:", description);
    console.log("- Ingredients:", ingredients);
    console.log("- Steps:", steps);
    console.log("- Selected categories:", selectedCategories);
    console.log("- Image file:", imageFile);

    try {      // Validate required fields
      console.log("✅ Starting validation...");
      
      if (!recipeName.trim()) {
        console.log("❌ Recipe name validation failed");
        toast.error("Vui lòng nhập tên món ăn");
        setIsSubmitting(false);
        return;
      }      // Description is now optional - removed validation
      // if (!description.trim()) {
      //   console.log("❌ Description validation failed");
      //   toast.error("Vui lòng nhập mô tả món ăn");
      //   setIsSubmitting(false);
      //   return;
      // }

      if (ingredients.some((ing) => !ing.name.trim() || !ing.amount.trim())) {
        console.log("❌ Ingredients validation failed");
        console.log("Invalid ingredients:", ingredients.filter(ing => !ing.name.trim() || !ing.amount.trim()));
        toast.error("Vui lòng điền đầy đủ thông tin nguyên liệu");
        setIsSubmitting(false);
        return;
      }
      
      if (steps.some((step) => !step.detail.trim())) {
        console.log("❌ Steps validation failed");
        console.log("Invalid steps:", steps.filter(step => !step.detail.trim()));
        toast.error("Vui lòng điền đầy đủ thông tin các bước thực hiện");
        setIsSubmitting(false);
        return;
      }

      console.log("✅ All validation passed!");      // Upload main recipe image to Cloudinary first
      console.log("📸 Starting image uploads...");
      let mainImageUrl = null;
      if (imageFile) {
        console.log("📤 Uploading main recipe image:", imageFile);
        toast.info("Đang tải ảnh chính lên...");
        try {
          const uploadResult = await uploadImage(imageFile, "recipes");
          console.log("✅ Main image upload successful:", uploadResult);
          mainImageUrl = uploadResult.secure_url;
        } catch (error) {
          console.error("❌ Main image upload failed:", error);
          throw new Error("Lỗi khi tải ảnh chính: " + error.message);
        }
      } else {
        console.log("ℹ️ No main image to upload");
      }

      // Upload step images to Cloudinary
      console.log("🔄 Processing steps and uploading step images...");
      const stepsData = [];      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        console.log(`🔄 Processing step ${i + 1}:`, step);
        
        const stepData = {
          step: `${
            step.summary ? step.summary.trim() + ": " : ""
          }${step.detail.trim()}`,
          time: step.time ? parseInt(step.time) : null,
          images: [], // Store Cloudinary URLs
        };

        // Upload step images to Cloudinary
        if (step.images && step.images.length > 0) {
          console.log(`📤 Uploading ${step.images.length} images for step ${i + 1}`);
          toast.info(`Đang tải ảnh bước ${i + 1}...`);
          
          for (const img of step.images) {
            try {
              console.log("📤 Uploading step image:", img);
              const uploadResult = await uploadImage(img.file, "recipes/steps");
              console.log("✅ Step image upload successful:", uploadResult);
              stepData.images.push(uploadResult.secure_url);
            } catch (error) {
              console.error(`❌ Step image upload failed for step ${i + 1}:`, error);
              throw new Error(`Lỗi khi tải ảnh bước ${i + 1}: ` + error.message);
            }
          }
        }

        stepsData.push(stepData);
      }

      console.log("✅ All step processing completed:", stepsData);

      // Prepare recipe data
      console.log("📋 Preparing recipe data...");      const recipeData = {
        name: recipeName.trim(),
        description: description.trim() || "", // Allow empty description
        servings: parseInt(servings) || 1,
        time: parseInt(cookingTime) || 30,ingredients: ingredients.map((ing) => ({
          name: ing.name.trim(),
          amount: parseFloat(ing.amount) || 1, // Use 'amount' to match form field
          quantity: parseFloat(ing.amount) || 1, // Keep 'quantity' for backend compatibility
          unit: ing.unit || "",
          ingredientId: ing.ingredientId || null,
        })),
        steps: stepsData,
        categories: selectedCategories,
        image: mainImageUrl ? [mainImageUrl] : [], // Send as array
      };

      console.log("📋 Final recipe data to submit:", recipeData);

      console.log("🌐 Calling createRecipe API...");
      const response = await createRecipe(recipeData);
      console.log("🌐 API Response received:", response);

      if (response?.data?.success) {
        console.log("✅ Recipe creation successful!");
        console.log("📍 Recipe ID:", response.data.data._id);
        toast.success("Công thức đã được tạo thành công!");
        // Navigate to recipe detail or recipes list
        navigate(`/recipes/${response.data.data._id}`);
      } else {
        console.log("❌ Recipe creation failed - Unexpected response structure");
        console.log("Response:", response);
        throw new Error("Phản hồi không hợp lệ từ server");
      }    } catch (error) {
      console.error("❌ Recipe creation failed:");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response);
      console.error("Error stack:", error.stack);
      
      if (error.response?.data) {
        console.error("Server error response:", error.response.data);
      }
      
      toast.error(
        error.response?.data?.message || error.message || "Có lỗi xảy ra khi tạo công thức"
      );
    } finally {
      console.log("🏁 Recipe creation process ended");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="py-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-gray-900 leading-tight">
          Tạo công thức mới
        </h1>
        <p className="text-gray-800 mt-2">
          Chia sẻ công thức nấu ăn yêu thích của bạn
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
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 text-gray-500 mb-3" />
                      <span className="text-gray-700 font-medium">
                        Tải ảnh lên
                      </span>
                      <span className="text-gray-500 text-sm mt-1">
                        PNG, JPG, GIF
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Recipe Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label
                  htmlFor="recipeName"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Tên món ăn
                </label>
                <input
                  id="recipeName"
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="Ví dụ: Gà rán giòn rụm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base"
                  required
                />
              </div>{" "}
              <div>
                <label
                  htmlFor="description"
                  className="block text-base font-medium text-gray-700 mb-2"
                >
                  Mô tả món ăn
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Mô tả ngắn gọn về món ăn của bạn..."
                  rows={3}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
              {/* Quick Info */}{" "}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Số người ăn
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setServings(Math.max(1, parseInt(servings) - 1))
                      }
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
                    Thời gian nấu (phút)
                  </label>
                  <input
                    type="number"
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="30"
                    min="1"
                  />
                </div>
              </div>{" "}
              {/* Categories */}
              <div>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Danh mục món ăn
                </label>{" "}
                <p className="text-sm text-gray-500 mb-3">
                  Chọn các danh mục phù hợp với món ăn của bạn
                </p>{" "}
                <div className="flex flex-wrap gap-2 py-1">
                  {selectedCategories
                    .slice(0, visibleCategoryCount)
                    .map((categoryId, index) => {
                      // Find the full category object by ID
                      let categoryName = "Unknown";

                      // Search through all category groups for the matching category
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
                          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-amber-500 text-white shadow-md"
                          onClick={() => {
                            // Find the full category object to pass to toggleCategory
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
                        </button>
                      );
                    })}
                  {selectedCategories.length > visibleCategoryCount && (
                    <div className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                      +{selectedCategories.length - visibleCategoryCount}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={openCategoryModal}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </button>{" "}
                </div>{" "}
                <CategoryModal
                  isOpen={showCategoryModal}
                  onClose={closeCategoryModal}
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onToggleCategory={toggleCategory}
                  onClearAll={() => setSelectedCategories([])}
                />
              </div>
            </div>
          </div>{" "}
          {/* Content Sections */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Ingredients Section */}
            <div className="bg-gray-50 rounded-xl border border-gray-200">
              <div className="p-6">
                {" "}
                <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                  <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                    1
                  </span>
                  Nguyên liệu
                </h3>
                <div className="space-y-3">
                  {ingredients.map((ingredient, idx) => (
                    <div
                      key={ingredient.id}
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
                          />

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
                                Đã chọn
                              </span>
                            </div>
                          )}
                          {activeIngredientIndex === idx &&
                            ingredientSuggestions.length > 0 && (
                              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto">
                                {ingredientSuggestions.map((suggestion) => (
                                  <button
                                    key={suggestion._id}
                                    type="button"
                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                                    onClick={() =>
                                      handleSelectIngredient(suggestion, idx)
                                    }
                                  >
                                    <div className="flex justify-between">
                                      <span>{suggestion.name}</span>
                                      {suggestion.unit && (
                                        <span className="text-gray-500 text-xs">
                                          ({suggestion.unit})
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>{" "}
                      <div className="w-24">
                        <select
                          value={ingredient.unit}
                          onChange={(e) =>
                            handleIngredientChange(idx, "unit", e.target.value)
                          }
                          disabled={!!ingredient.ingredientId}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                            ingredient.ingredientId
                              ? "border-green-500 bg-green-50 text-gray-600 cursor-not-allowed"
                              : "border-gray-300"
                          }`}
                          title={
                            ingredient.ingredientId
                              ? "Đơn vị được khóa cho nguyên liệu từ database"
                              : ""
                          }
                        >
                          <option value="">Đơn vị</option>
                          {getDynamicIngredientUnits(ingredient).map((unit) => (
                            <option key={unit.value} value={unit.value}>
                              {unit.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeIngredient(idx)}
                          className="text-red-500 border-red-200 hover:bg-red-50"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addIngredient}
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm nguyên liệu
                  </Button>
                </div>
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
                  {" "}
                  {steps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-400"
                    >
                      {" "}
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                          {idx + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Tiêu đề bước (tuỳ chọn)"
                              value={step.summary}
                              onChange={(e) =>
                                handleStepChange(idx, "summary", e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-medium text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Thời gian"
                              value={step.time}
                              onChange={(e) =>
                                handleStepChange(idx, "time", e.target.value)
                              }
                              className="w-20 px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-center text-sm"
                            />
                          </div>
                          <textarea
                            placeholder="Mô tả chi tiết cách thực hiện..."
                            value={step.detail}
                            onChange={(e) =>
                              handleStepChange(idx, "detail", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none text-sm"
                            rows={2}
                            required
                          />

                          {/* Step Image Upload */}
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {step.images &&
                                step.images.map((image, imageIdx) => (
                                  <div
                                    key={imageIdx}
                                    className="relative w-20 h-20"
                                  >
                                    <img
                                      src={image.preview}
                                      alt={`Step ${idx + 1} image ${
                                        imageIdx + 1
                                      }`}
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
                        {steps.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeStep(idx)}
                            className="text-red-500 border-red-200 hover:bg-red-50 flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addStep}
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm bước
                  </Button>
                </div>
              </div>
            </div>{" "}
          </div>
          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
            <Button
              type="submit"
              className="px-8 py-3 text-sm font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang tạo..." : "Chia sẻ công thức"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
